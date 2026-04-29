/**
 * Icon styling options: padding, border radius, background color.
 *
 * @package FormaFavicon
 */

import { useId } from '@wordpress/element';

interface Props {
	padding: number;
	borderRadius: number;
	iconBgColor: string;
	onPaddingChange: (value: number) => void;
	onBorderRadiusChange: (value: number) => void;
	onIconBgColorChange: (value: string) => void;
}

const RangeField = ({
	label,
	value,
	min,
	max,
	unit,
	onChange,
}: {
	label: string;
	value: number;
	min: number;
	max: number;
	unit: string;
	onChange: (v: number) => void;
}) => {
	const id = useId();

	return (
		<div>
			<label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-2">
				{label}
				<span className="ml-2 text-xs text-gray-400 font-normal">
					{value}
					{unit}
				</span>
			</label>
			<input
				id={id}
				type="range"
				min={min}
				max={max}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className="w-full accent-primary cursor-pointer"
			/>
		</div>
	);
};

const TileBackgroundField = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
	const colorId = useId();

	return (
		<div>
			<label htmlFor={colorId} className="block text-sm font-medium text-gray-600 mb-2">
				Tile Background
			</label>
			<div className="flex items-center gap-3">
				<input
					id={colorId}
					type="color"
					value={value || '#ffffff'}
					onChange={(e) => onChange(e.target.value)}
					className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
				/>
				<input
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder="transparent"
					aria-label="Tile background hex value"
					className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white w-28 font-mono"
				/>
				{value && (
					<button
						type="button"
						onClick={() => onChange('')}
						className="text-xs text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer"
						title="Reset to transparent"
					>
						✕
					</button>
				)}
			</div>
			<p className="text-xs text-gray-400 mt-2 m-0">Only visible where the source image is transparent.</p>
		</div>
	);
};

export const IconOptions = ({
	padding,
	borderRadius,
	iconBgColor,
	onPaddingChange,
	onBorderRadiusChange,
	onIconBgColorChange,
}: Props) => (
	<div className="mb-8 p-6 bg-white rounded-xl border-2 border-gray-100">
		<h2 className="text-base font-medium text-gray-700 m-0 mb-4">Icon Shape</h2>
		<p className="text-xs text-gray-400 m-0 mb-5">
			Adjust spacing, corner roundness, and tile background applied to all generated favicon sizes.
		</p>
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
			<RangeField label="Edge Spacing" value={padding} min={0} max={40} unit="%" onChange={onPaddingChange} />
			<RangeField
				label="Corner Roundness"
				value={borderRadius}
				min={0}
				max={50}
				unit="%"
				onChange={onBorderRadiusChange}
			/>
			<TileBackgroundField value={iconBgColor} onChange={onIconBgColorChange} />
		</div>
	</div>
);
