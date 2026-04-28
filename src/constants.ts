/**
 * Static configuration constants.
 *
 * @package FormaFavicon
 */

import type { PreviewSize } from './types';

export const PREVIEW_SIZES: PreviewSize[] = [
    { file: 'source.png', label: 'Source', desc: 'Working image' },
    { file: 'favicon-32x32.png', label: '32×32', desc: 'Taskbar' },
    { file: 'favicon-48x48.png', label: '48×48', desc: 'Desktop shortcut' },
    { file: 'apple-touch-icon.png', label: '180×180', desc: 'Apple Touch Icon' },
    { file: 'android-chrome-192x192.png', label: '192×192', desc: 'Android Chrome' },
    { file: 'android-chrome-512x512.png', label: '512×512', desc: 'PWA Splash' },
];

export const ADDITIONAL_FILES = ['favicon.ico', 'site.webmanifest', 'browserconfig.xml'];
