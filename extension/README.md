# Mod-Mate Browser Extension MVP

This folder contains the first Chrome/Chromium extension scaffold for MOD-25.

The extension is intentionally small and explicit:

- It only captures text the user selects.
- It does not silently scrape the page.
- It does not write back into the page.
- It does not require auth yet.
- It does not ship to the Chrome Web Store yet.

## Local testing

1. Run the Mod-Mate app locally:

```bash
npm run dev
```

2. Open Chrome / Edge and go to:

```txt
chrome://extensions
```

3. Enable **Developer mode**.

4. Click **Load unpacked**.

5. Select this folder:

```txt
extension
```

6. Open any web page, highlight text, then click the Mod-Mate extension icon.

## Current behavior

The popup asks the active tab for the current selected text. If selected text exists, it shows:

- page title
- page URL
- selected text preview
- a generic companion prompt draft
- buttons to open Mod-Mate's side-panel preview
- a copy-context button for manual testing

## Next phase

Later tickets should wire this into:

- account sign-in
- companion selection
- live runtime calls
- host adapter selection
- safe per-site adapters
- optional write-back actions with explicit confirmation

Do not add silent page scraping or automatic writes without a separate security/privacy review.
