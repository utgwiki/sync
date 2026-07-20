---
icon: lucide/cloud-lightning
---

# Bypassing Cloudflare

When using Cloudflare Bot Fight Mode with WikiWire, Cloudflare might get in the way of WikiWire contacting the MediaWiki Action API (typically at `/api.php`). In many cases, this can bring 403 errors directly to your CI. Luckily, there are a few fixes.

## Disable Bot Fight Mode for /api.php

If your current Cloudflare plan allows for it, you can add a WAF rule to disable Bot Fight Mode on /api.php paths. Please note that Super Bot Fight Mode is not the same as Bot Fight Mode.

## Use a Bypassing CI action

Like the Obby Wiki does, you can use a Cloudflare bypassing CI action such as `xiaotianxt/bypass-cloudflare-for-github-action`.

```yaml
- name: Bypass Cloudflare for GitHub Action
        uses: xiaotianxt/bypass-cloudflare-for-github-action@v2.1.0
        with:
          cf_account_id: ${{ secrets.CF_ACCOUNT_ID }}
          cf_zone_id: ${{ secrets.CF_ZONE_ID }}
          cf_api_token: ${{ secrets.CF_API_TOKEN }}
          disable_bot_fight_mode: 'true'
```

Make sure to configure each variable as specified here: https://github.com/xiaotianxt/bypass-cloudflare-for-github-action