-- this code is shared with multiple wikis, please edit the module in https://github.com/utgwiki/wikiwire instead of here.
-- any changes made here will be overwritten without warning

local p = {}
local args = {}
local origArgs = {}

local function union(t1, t2)
	local vals = {}
	for _, v in pairs(t1) do vals[v] = true end
	for _, v in pairs(t2) do vals[v] = true end
	local ret = {}
	for k in pairs(vals) do table.insert(ret, k) end
	return ret
end

local function getArgNums(prefix)
	local nums = {}
	for k in pairs(args) do
		local num = tostring(k):match('^' .. prefix .. '([1-9]%d*)$')
		if num then table.insert(nums, tonumber(num)) end
	end
	table.sort(nums)
	return nums
end

local function getDetailsHTML(data, frame)
	local summary = frame:extensionTag {
		name = 'summary',
		content = data.summary.content,
		args = { class = data.summary.class }
	}
	local details = frame:extensionTag {
		name = 'details',
		content = summary .. data.details.content,
		args = {
			class = data.details.class,
			role = data.details.role,
			open = data.details.open or 'no'
		}
	}
	return details
end

local function getRowHTML()
	local frame = mw.getCurrentFrame()
	local html = mw.html.create()
	html
		:tag('div')
		:addClass('template-navplate-item__list')
		-- :tag('div')
		-- :addClass('mw-references-wrap')
		:wikitext(frame:extensionTag { 
            name = 'references',
            args = { group = 'note' }
        })
	return html
end

local function getTitleHTML()
	local html = mw.html.create('div')
	html:addClass('template-navplate__headerContent')

	local titleText = args.title or 'Notes'

	if args.subtitle then
		html
			:tag('div')
			:addClass('template-navplate__subtitle')
			:wikitext(args.subtitle)
			:done()
	end

	html
		:tag('div')
		:addClass('template-navplate__title')
		:wikitext(titleText)

	return html
end

local function getRowsHTML()
	local html = mw.html.create()
	html:node(getRowHTML()) -- Only output a references row
	return html
end

local function preprocessSingleArg(argName)
	if origArgs[argName] and origArgs[argName] ~= '' then
		args[argName] = origArgs[argName]
	end
end

local function parseDataParameters()
	preprocessSingleArg('id')
	preprocessSingleArg('subtitle')
	preprocessSingleArg('title')
	-- Do not parse headers, labels, or lists
end

local function _navplate()
	local frame = mw.getCurrentFrame()

	local summaryHTML = mw.html.create()
		:tag('div')
		:addClass('citizen-ui-icon mw-ui-icon-wikimedia-collapse')
		:done()
		:node(getTitleHTML())

	local contentHTML = mw.html.create('div')
		:addClass('template-navplate__content citizen-text-small')
		:node(getRowsHTML())

	local output = getDetailsHTML({
		details = {
			class = 'template-navplate template-refplate',
			content = tostring(contentHTML)
		},
		summary = {
			class = 'template-navplate__header',
			content = tostring(summaryHTML)
		}
	}, frame)

	return frame:extensionTag {
		name = 'templatestyles', args = { src = 'Module:Navplate/styles.css' }
	} .. output
end

function p.navplate(frame)
	if frame == mw.getCurrentFrame() then
		origArgs = frame:getParent().args
	else
		origArgs = frame
	end
	parseDataParameters()
	return _navplate()
end

function p.navplateTemplate(frame)
	origArgs = {}
	for k, v in pairs(frame.args) do
		origArgs[k] = mw.text.trim(v)
	end
	parseDataParameters()
	return _navplate()
end

function p.fromData(data)
	local directArgs = {}
	if data and type(data) == 'table' then
		if data.title then directArgs.title = data.title end
		if data.subtitle then directArgs.subtitle = data.subtitle end
		if data.id then directArgs.id = data.id end
	end
	return p.navplateTemplate({ args = directArgs })
end

return p
