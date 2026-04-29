# Roadmap

## Quick Wins

| Feature | Description |
|---------|-------------|
| **Dark mode favicon** | Upload a separate icon for dark mode (`prefers-color-scheme: dark`). Modern browsers support this via `<link media="...">` |

## Advanced

| Feature | Description |
|---------|-------------|
| **SVG favicon** | Serve native SVG favicon for modern browsers (sharper at any size). Falls back to ICO for old browsers |
| **Maskable icon** | Generate a "safe zone" version for Android adaptive icons |
| **PWA manifest editor** | Let users edit app name, short name, display mode, orientation |

## Nice to Have

| Feature | Description |
|---------|-------------|
| **Favicon from text** | Generate a simple letter/emoji favicon (like Notion does with page icons) |
| **History/versioning** | Keep previous favicon versions, easy rollback |
| **Import from URL** | Paste a URL to fetch an existing favicon |
| **Export package** | Download a ZIP with all generated files |

## Preview Ideas

| Preview | Description | Priority |
|---------|-------------|----------|
| **iOS / Android home screen** | Apple Touch Icon (180px) and Android Chrome icon (192px) with rounded mask + label text, simulating the actual launcher | High |
| **Bookmark bar** | 16px favicon inline in a row of bookmark items to test legibility at smallest size | High |
| **PWA splash screen** | 512px icon centered on bg_color background, simulating the PWA startup screen | Medium |
| **PWA install prompt** | Mock of the Chrome on Android "Add to Home screen" sheet using theme_color and the icon | Medium |
| **Multiple tabs** | 4-5 tabs where the favicon is one among others to test distinguishability | Medium |
| **Windows taskbar** | 32px icon in a simulated Windows 11 taskbar strip | Low |
| **macOS Dock** | 512px icon with Dock shelf, showing how it looks as a saved web app | Low |
| **Browser address bar** | 16px favicon next to the URL in Chrome/Safari/Firefox | Low |
| **Discord / Slack link embed** | Favicon next to an unfurled link card | Low |

## Priority Suggestions

1. **Dark mode favicon** - very modern, easy to implement
2. **SVG favicon output** - better quality, smaller file size
3. **Maskable icon** - Android adaptive icon safe zone
