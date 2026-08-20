---
name: LingoLens
status: open
tagline: BYOK Gemini translation for the browser — full page, selection, and in-image text
order: 2
platforms:
  - Edge Add-ons
  - Chrome Web Store
  - Manifest V3
capabilities:
  - key: Full-page translation
    value: One-click translate and restore the original page text
  - key: Selection translation
    value: Instant inline translation for selected text without leaving the page
  - key: Image text
    value: Right-click detection and translation for text inside images
  - key: Local API keys
    value: BYOK — keys stay in local storage; requests go only to Google Gemini
gallery:
  - src: /image/01-selection.png
    caption: Selection translation — inline result without leaving the reading flow
  - src: /image/02-page-translate.png
    caption: Full-page translation — in-place rewrite with one-click restore
  - src: /image/03-image-text.png
    caption: Image text — detect and translate text embedded in page images
links:
  github: https://github.com/Axonvale/lingolens
  storeChrome: https://chromewebstore.google.com/detail/lingolens/kejgjnfaaiolcidnkkicchjampbcpgei
  storeEdge: https://microsoftedge.microsoft.com/addons/detail/lingolens/kopfklpfjhfmldfpaoehpobjcadaiomd
---

Open-source browser extension (AGPL-3.0) for Gemini-powered translation. Ships on Chrome Web Store and Microsoft Edge Add-ons, with local key handling, site blacklist, optional TTS, and bounded concurrency.
