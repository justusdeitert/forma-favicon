/**
 * Root component for the Favicon admin page.
 *
 * @package FormaFavicon
 */

import { useEffect, useState } from '@wordpress/element';
import { useFavicon } from '../hooks/use-favicon';
import { useFaviconPreview } from '../hooks/use-favicon-preview';
import { getWindowData } from '../utils/get-data';
import { Actions } from './Actions';
import { BrowserTabPreview } from './BrowserTabPreview';
import { ColorPickers } from './ColorPickers';
import { ConflictNotice } from './ConflictNotice';
import { CropModal } from './CropModal';
import { DeleteModal } from './DeleteModal';
import { GoogleSearchPreview } from './GoogleSearchPreview';
import { IconOptions } from './IconOptions';
import { Notice } from './Notice';
import { Preview } from './Preview';
import { SiteIconNotice } from './SiteIconNotice';
import { SourceImage } from './SourceImage';

export const AdminFaviconApp = () => {
	const {
		sourceId,
		sourceUrl,
		generated,
		themeColor,
		bgColor,
		padding,
		borderRadius,
		iconBgColor,
		saving,
		deleting,
		notice,
		cacheBuster,
		faviconUrl,
		hasUnsavedChanges,
		cropImageUrl,
		setThemeColor,
		setBgColor,
		setPadding,
		setBorderRadius,
		setIconBgColor,
		openMediaLibrary,
		generate,
		deleteFavicons,
		applyCrop,
		cancelCrop,
	} = useFavicon();

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [previewDark, setPreviewDark] = useState(
		() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches,
	);
	const { conflicts } = getWindowData();

	// Follow system color-scheme changes while the page is open.
	useEffect(() => {
		const mql = window.matchMedia?.('(prefers-color-scheme: dark)');
		if (!mql) return;
		const onChange = (e: MediaQueryListEvent) => setPreviewDark(e.matches);
		mql.addEventListener('change', onChange);
		return () => mql.removeEventListener('change', onChange);
	}, []);

	const livePreviewUrl = useFaviconPreview({
		sourceUrl,
		padding,
		borderRadius,
		iconBgColor,
	});

	return (
		<div className="max-w-4xl">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-2xl font-semibold text-gray-900 m-0 mb-2">Favicon</h1>
				<p className="text-sm text-gray-500 m-0">
					Upload a source image (at least 512×512 px) and generate all favicon sizes including ICO, Apple Touch Icon,
					Android Chrome icons, and web manifest.
				</p>
			</div>

			<ConflictNotice conflicts={conflicts} />

			{generated && <SiteIconNotice />}

			{notice && <Notice notice={notice} />}

			<SourceImage sourceUrl={sourceUrl} onSelect={openMediaLibrary} />

			{sourceId > 0 && (
				<ColorPickers
					themeColor={themeColor}
					bgColor={bgColor}
					onThemeColorChange={setThemeColor}
					onBgColorChange={setBgColor}
				/>
			)}

			{sourceId > 0 && (
				<IconOptions
					padding={padding}
					borderRadius={borderRadius}
					iconBgColor={iconBgColor}
					onPaddingChange={setPadding}
					onBorderRadiusChange={setBorderRadius}
					onIconBgColorChange={setIconBgColor}
				/>
			)}

			{sourceId > 0 && (
				<Actions
					generated={generated}
					saving={saving}
					deleting={deleting}
					onGenerate={generate}
					onDelete={() => setShowDeleteModal(true)}
				/>
			)}

			{showDeleteModal && (
				<DeleteModal
					deleting={deleting}
					onConfirm={() => {
						setShowDeleteModal(false);
						deleteFavicons();
					}}
					onCancel={() => setShowDeleteModal(false)}
				/>
			)}

			{cropImageUrl && <CropModal imageUrl={cropImageUrl} onCrop={applyCrop} onCancel={cancelCrop} />}

			{sourceId > 0 && (
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-2">
						<h2 className="text-base font-medium text-gray-700 m-0">Preview</h2>
						{hasUnsavedChanges && (
							<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
								Unsaved
							</span>
						)}
					</div>

					{/* Light / Dark toggle */}
					<div className="inline-flex items-center gap-1 p-0.5 mb-4 rounded-lg bg-gray-100 text-xs font-medium">
						<button
							type="button"
							onClick={() => setPreviewDark(false)}
							className={`px-3 py-1.5 rounded-md border-none cursor-pointer transition-colors ${
								!previewDark ? 'bg-white text-gray-800 shadow-sm' : 'bg-transparent text-gray-400 hover:text-gray-600'
							}`}>
							☀ Light
						</button>
						<button
							type="button"
							onClick={() => setPreviewDark(true)}
							className={`px-3 py-1.5 rounded-md border-none cursor-pointer transition-colors ${
								previewDark ? 'bg-gray-800 text-white shadow-sm' : 'bg-transparent text-gray-400 hover:text-gray-600'
							}`}>
							☾ Dark
						</button>
					</div>

					<BrowserTabPreview
						faviconUrl={faviconUrl}
						cacheBuster={cacheBuster}
						livePreviewUrl={hasUnsavedChanges || !generated ? livePreviewUrl : undefined}
						unsaved={hasUnsavedChanges}
						dark={previewDark}
					/>

					<GoogleSearchPreview
						faviconUrl={faviconUrl}
						cacheBuster={cacheBuster}
						livePreviewUrl={hasUnsavedChanges || !generated ? livePreviewUrl : undefined}
						dark={previewDark}
					/>
				</div>
			)}

			{generated && <Preview faviconUrl={faviconUrl} cacheBuster={cacheBuster} />}
		</div>
	);
};
