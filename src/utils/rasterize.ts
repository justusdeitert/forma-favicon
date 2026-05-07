/**
 * Rasterize an image URL (typically SVG) to a base64 PNG via canvas.
 *
 * @package FormaFavicon
 */

import { getContainFit } from './contain-fit';

export function rasterizeToBase64(imageUrl: string, size = 512): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';

		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext('2d');

			if (!ctx) {
				return reject(new Error('Canvas not supported'));
			}

			// Preserve aspect ratio: fit the image inside the square canvas
			// and center it, leaving transparent padding on the shorter axis.
			const fit = getContainFit(
				img.naturalWidth || img.width,
				img.naturalHeight || img.height,
				size,
				size,
			);

			ctx.clearRect(0, 0, size, size);
			ctx.drawImage(img, fit.x, fit.y, fit.width, fit.height);
			resolve(canvas.toDataURL('image/png'));
		};

		img.onerror = () => reject(new Error('Failed to load image'));
		img.src = imageUrl;
	});
}
