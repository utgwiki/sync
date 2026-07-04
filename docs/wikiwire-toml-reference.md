---
icon: lucide/cog
---

# wikiwire.toml Reference

The `wikiwire.toml` file is the main configuration file to configure how WikiWire behaves. By default, it should be at the root level in the repository.

## version (integer)

The version of the config schema. Reserved for future use. Set to `1`.

```
version = 1
```

## shared (boolean)

Whether to enable the shared sites folder or not. If set to false, WikiWire will throw an error whenever it reads the /shared directory of modules/ or templates/.

```
shared = false
```

## common (boolean)

Whether to enable the common sites folder or not. If set to false, WikiWire will throw an error whenever it reads the /common directory of modules/ or templates/. When enabled, content is synced only to `[[sites]]` entries that set `common = true`.

```
common = false
```

## [[sites]] (repeatable) (required)

A `[[sites]]` defines a site. At minimum one of these entries must be provided.

### id (string) (required)

Stable site key (sessions, logs). Must be unique across rows.

### host (string)

Directory name under modules/ and templates/. If omitted, defaults to id. Must be unique across sites. Cannot be `shared` when `shared = true` or `common` when `common = true` (those names are reserved).

### api (string) (required)

Full MediaWiki API URL, e.g. https://example.org/w/api.php.

### dry_run (boolean)

If true, only log planned edits; no action=edit requests for this site.

### default_branch (string)

If set, the action skips syncing when the workflow ref is not this branch (e.g. refs/heads/main).

### css_content_model (string)

Content model for `*.css` files under modules/ and templates/. Default is `sanitized-css`. Some wikis need `css`.

### common (boolean)

If true, this site receives content from `modules/common/` and `templates/common/` when top-level `common = true`. Default false.

# Configuration example

```yaml
# This is a global WikiWire configuration file, a CI action which automatically syncs and uploads modules and templates from a Git repo towards a production or upstream MediaWiki instance via bot passwords and the MediaWiki Action API.
# Learn more: https://github.com/obbywiki/wikiwire

version = 1
shared = true
common = true

[[sites]]
id = "obbywiki"
host = "obby.wiki"
api = "https://obby.wiki/api.php"
common = true

[[sites]]
id = "dev"
host = "dev.example.org"
api = "https://dev.example.org/w/api.php"
dry_run = true
default_branch = "main"
css_content_model = "css"

```

# GitHub Action inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `username` | no | `""` | Default bot username for sites not listed in `site_credentials`. With [Bot passwords](https://www.mediawiki.org/wiki/Manual:Bot_passwords), use `UserName@BotPasswordName`. |
| `password` | no | `""` | Default bot password for sites not listed in `site_credentials`. |
| `site_credentials` | no | `""` | JSON object whose keys are site `id` values from `wikiwire.toml` (not `host`). Each value must be `{"username":"…","password":"…"}`. Overrides the global `username` / `password` for that site. Keys that do not match any configured site produce a workflow warning. |
| `config_path` | no | `wikiwire.toml` | Path to the TOML config. |
| `ignore_path` | no | `.wikiwireignore` | Path to the ignore file (may be missing). |
| `dry_run` | no | `false` | If `true`, no edits are sent (site-level `dry_run` in TOML still applies per site). |
| `sync_all` | no | `false` | If set to `'override'`, every file under `modules/` and `templates/` from the workspace will be synced instead of those that changes per-commit. Requires a prior checkout of the repo. Not recommended as this may potentially be destructive. Previously this parameter accepted `true`, but that was changed in v0.3.0 |

`dark_lua_compat` was removed in WikiWire v0.3.0, and supplying it as a parameter will produce an error.

Use a workflow `permissions` block with at least `contents: read` so the default `GITHUB_TOKEN` can call the compare API.

Every site that performs a real (non–dry-run) sync must resolve to a username and password: either the global inputs or a matching entry in `site_credentials`.