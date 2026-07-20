# Minification with Darklua

One of the reasons that WikiWire was invented was because of Lua minification. Lua minification is difficult, but provides a shorter file size and in some cases increased performance. Minification should only be used by those already familiar with Darklua and Lua 5.1, as Darklua can sometimes lead to outputs that are not supported in Scribunto.

WikiWire will upload any content it sees that matches its format and is not ignored. As such, you can minify files and overwrite your source files (in the CI only), and WikiWire will upload those instead.

The Obby Wiki uses this to transpile Luau, so modules can be written in Luau and safely used on-wiki. However, this process is not public yet.