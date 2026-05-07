/**
 * Compute contain-fit placement: scale (naturalW x naturalH) into a
 * (boxW x boxH) area while preserving aspect ratio, centered.
 *
 * @package FormaFavicon
 */

export interface ContainFit {
	x: number;
	y: number;
	width: number;
	height: number;
}

export function getContainFit(
	naturalW: number,
	naturalH: number,
	boxW: number,
	boxH: number,
	offsetX = 0,
	offsetY = 0,
): ContainFit {
	const safeW = naturalW > 0 ? naturalW : boxW;
	const safeH = naturalH > 0 ? naturalH : boxH;
	const scale = Math.min(boxW / safeW, boxH / safeH);
	const width = Math.max(1, safeW * scale);
	const height = Math.max(1, safeH * scale);
	const x = offsetX + (boxW - width) / 2;
	const y = offsetY + (boxH - height) / 2;
	return { x, y, width, height };
}
