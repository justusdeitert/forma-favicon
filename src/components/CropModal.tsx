/**
 * Modal dialog for cropping a source image to a 1:1 aspect ratio.
 *
 * @package FormaFavicon
 */

import { useCallback, useRef, useState } from '@wordpress/element';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface Props {
	imageUrl: string;
	onCrop: (croppedDataUrl: string) => void;
	onCancel: () => void;
}

function getInitialCrop(width: number, height: number): Crop {
	return centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 1, width, height), width, height);
}

export const CropModal = ({ imageUrl, onCrop, onCancel }: Props) => {
	const [crop, setCrop] = useState<Crop>();
	const imgRef = useRef<HTMLImageElement>(null);

	const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
		const { naturalWidth, naturalHeight } = e.currentTarget;
		setCrop(getInitialCrop(naturalWidth, naturalHeight));
	}, []);

	const handleConfirm = useCallback(() => {
		const img = imgRef.current;
		if (!img || !crop) return;

		let cropX: number, cropY: number, cropW: number, cropH: number;

		if (crop.unit === '%') {
			cropX = (crop.x / 100) * img.naturalWidth;
			cropY = (crop.y / 100) * img.naturalHeight;
			cropW = (crop.width / 100) * img.naturalWidth;
			cropH = (crop.height / 100) * img.naturalHeight;
		} else {
			const scaleX = img.naturalWidth / img.width;
			const scaleY = img.naturalHeight / img.height;
			cropX = crop.x * scaleX;
			cropY = crop.y * scaleY;
			cropW = crop.width * scaleX;
			cropH = crop.height * scaleY;
		}

		const canvas = document.createElement('canvas');
		const size = Math.round(Math.max(cropW, cropH));
		canvas.width = size;
		canvas.height = size;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.drawImage(img, Math.round(cropX), Math.round(cropY), Math.round(cropW), Math.round(cropH), 0, 0, size, size);

		onCrop(canvas.toDataURL('image/png'));
	}, [crop, onCrop]);

	return (
		<div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50">
			<div className="bg-white rounded-xl shadow-xl max-w-xl w-full mx-4 p-6">
				<h2 className="text-base font-medium text-gray-700 m-0 mb-4">Crop Image</h2>
				<p className="text-xs text-gray-400 m-0 mb-4">
					Drag to select a square area. The selection will be used as your favicon source.
				</p>
				<div className="flex justify-center mb-6">
					<ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={1} circularCrop={false} className="max-h-[60vh]">
						<img
							ref={imgRef}
							src={imageUrl}
							alt="Crop source"
							onLoad={onImageLoad}
							className="max-h-[60vh] max-w-full"
							crossOrigin="anonymous"
						/>
					</ReactCrop>
				</div>
				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
						Cancel
					</button>
					<button
						type="button"
						onClick={handleConfirm}
						className="px-4 py-2 rounded-lg text-sm font-medium border-none bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-colors">
						Apply Crop
					</button>
				</div>
			</div>
		</div>
	);
};
