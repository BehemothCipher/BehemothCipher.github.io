# C.I.A. — Cipher Integrated Assistant
## Setup Guide

---

## What you get

- `cia-backend-endpoint.js` — Express router to add to your existing Render server
- `cia-widget.js` — Self-contained frontend widget, drop one script tag on your site

---

## Step 1 — Backend (your Render server)

### Install the Anthropic SDK
In your Render server folder:
```
npm install @anthropic-ai/sdk
```

### Add the endpoint
Copy `cia-backend-endpoint.js` to your server folder, then in your main `server.js`:
```js
const cia = require('./cia-backend-endpoint');
app.use('/api/cia', cia);
```

### Set environment variables on Render
In your Render dashboard → Environment:
```
ANTHROPIC_API_KEY=sk-ant-...
CIA_ALLOWED_ORIGIN=https://behemothlab.dev
```

---

## Step 2 — Frontend (behemothlab.dev)

Copy `cia-widget.js` to your site's root (or a `/js/` folder).

Add ONE line before `</body>` in your HTML:
```html
<script
  src="/cia-widget.js"
  data-cia-endpoint="https://YOUR-RENDER-APP.onrender.com/api/cia/chat">
</script>
```

Replace `YOUR-RENDER-APP` with your actual Render app name.

That's it. No other dependencies, no CSS files, no build step.

---

## What C.I.A. does

- **Greets every visitor** with an intro and asks what they're looking for
- **Navigates the site** — explains products, recommends the right kit, always mentions the free demo
- **Commission guidance** — asks 5 questions, scores complexity, recommends Tier 1/2/3, points to the form
- **Streams responses** word-by-word with a typing cursor
- **Remembers conversation context** — up to 20 messages of history per session
- **Rate limited** — 20 requests per IP per minute (stops abuse)
- **CORS locked** — only your domain can call the endpoint

---

## Customization

To change the greeting or what C.I.A. knows, edit the `CIA_SYSTEM` constant
in `cia-backend-endpoint.js` and redeploy.

To move the button position, override CSS in your site:
```css
#cia-fab  { bottom: 40px; right: 40px; }
#cia-panel { bottom: 112px; right: 40px; }
```

---

## Testing locally

```bash
# In your server folder
ANTHROPIC_API_KEY=sk-ant-... CIA_ALLOWED_ORIGIN=* node server.js

# Then open your site locally and the widget will connect
```
