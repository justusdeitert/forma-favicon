/**
 * Generate a live client-side favicon preview via canvas.
 *
 * Returns a data URL that updates whenever the source image
 * or styling options (padding, border radius, bg color) change.
 *
 * @package FormaFavicon
 */

import { useEffect, useState } from '@wordpress/element';
import { getContainFit } from '../utils/contain-fit';

interface PreviewOptions {
	sourceUrl: string;
	padding: number;
	borderRadius: number;
	iconBgColor: string;
	size?: number;
}

/**
 * Draw a rounded-rectangle clipping path on a canvas context using true
 * circular corners (arcTo). Smoothly degrades to a circle when r reaches
 * half the box size, with no visible discontinuity.
 */
function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
	const radius = Math.min(r, Math.min(w, h) / 2);
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.arcTo(x + w, y, x + w, y + h, radius);
	ctx.arcTo(x + w, y + h, x, y + h, radius);
	ctx.arcTo(x, y + h, x, y, radius);
	ctx.arcTo(x, y, x + w, y, radius);
	ctx.closePath();
}

export function useFaviconPreview({
	sourceUrl,
	padding,
	borderRadius,
	iconBgColor,
	size = 128,
}: PreviewOptions): string {
	const [previewUrl, setPreviewUrl] = useState('');

	useEffect(() => {
		if (!sourceUrl) {
			setPreviewUrl('');
			return;
		}

		const img = new Image();
		img.crossOrigin = 'anonymous';

		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			// Clear (transparent outside the padded icon area).
			ctx.clearRect(0, 0, size, size);

			// Calculate padding and inner icon box.
			const padPx = Math.round((size * padding) / 100);
			const iconSize = size - padPx * 2;

			if (iconSize <= 0) {
				setPreviewUrl(canvas.toDataURL('image/png'));
				return;
			}

			// Border radius is relative to the icon box, not the full canvas,
			// so padding stays transparent and the visible tile is what gets rounded.
			const radiusPx = Math.round((iconSize * borderRadius) / 100);

			ctx.save();
			if (radiusPx > 0) {
				roundedRect(ctx, padPx, padPx, iconSize, iconSize, radiusPx);
				ctx.clip();
			}

			// Fill background color inside the rounded icon box.
			if (iconBgColor) {
				ctx.fillStyle = iconBgColor;
				ctx.fillRect(padPx, padPx, iconSize, iconSize);
			}

			// Preserve aspect ratio (contain): fit the image inside the icon
			// box without stretching, centering on the shorter axis.
			const fit = getContainFit(
				img.naturalWidth || img.width,
				img.naturalHeight || img.height,
				iconSize,
				iconSize,
				padPx,
				padPx,
			);

			ctx.drawImage(img, fit.x, fit.y, fit.width, fit.height);
			ctx.restore();

			setPreviewUrl(canvas.toDataURL('image/png'));
		};

		img.onerror = () => {
			setPreviewUrl('');
		};

		img.src = sourceUrl;
	}, [sourceUrl, padding, borderRadius, iconBgColor, size]);

	return previewUrl;
}
