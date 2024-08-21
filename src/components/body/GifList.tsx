import React, { useMemo, useRef, useCallback } from 'react';
import { TenorImage } from '../../types/exposedTypes';
import './GifList.css';
import GifListPlaceholder from './GifListPlaceholder';
import ResultImage from './ResultImage';

export interface GifListProps {
  isLoading: boolean;
  images: TenorImage[];
  searchTerm?: string;
  columnsCount: number;
  onLoadMore: () => void;
  hasMore: boolean;
}

function GifList({ isLoading, images, searchTerm, columnsCount, onLoadMore, hasMore }: GifListProps): JSX.Element {
	const columns = useMemo(() => generateColumns(images, columnsCount), [ images, columnsCount ]);
	const isEmpty = images.length <= 0;
	const observer = useRef<IntersectionObserver | null>(null);
	const lastGifElementRef = useCallback((node: HTMLDivElement | null) => {
		if (isLoading) return;
		if (observer.current) observer.current.disconnect();
		observer.current = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && hasMore) {
				onLoadMore();
			}
		});
		if (node) observer.current.observe(node);
	}, [ isLoading, hasMore, onLoadMore ]);

	if (isEmpty) {
		if (isLoading) {
			return (<GifListPlaceholder columnsCount={columnsCount} />);
		}
		else {
			return (
				<div className='gpr-gif-list-no-result'>
					<span>No GIFs found!</span>
				</div>
			);
		}
	}

	return (
		<div className='gpr-gif-list'>
			{columns.map((col, i) => (
				<div className='gpr-gif-list-column' key={i}>
					{col.map((img, index) => (
						<div
							key={img.id}
							ref={index === col.length - 1 && i === columns.length - 1 ? lastGifElementRef : null}
						>
							<ResultImage image={img} searchTerm={searchTerm} />
						</div>
					))}
				</div>
			))}
		</div>
	);
}

/**
 * Splits TenorResult into grid of TenorImage with set amount of columns
 * Columns should have more or less similar height but don't necessarily need to
 * have fixed amount of elements, GIFs don't have uniform heights
 *
 * @returns array of columns (which are the arrays of TenorImage)
 */
function generateColumns(result?: TenorImage[], columnsCount = 2 ): TenorImage[][] {
	if(!result) return [];
	const columns: TenorImage[][] = new Array(columnsCount).fill(null).map(() => []);
	const columnsHeight = new Array(columnsCount).fill(0);

	for(const img of result) {
		const aspectRatio = img.preview.height / img.preview.width;
		// We want to put image of this loop in shortest column (smallest width)
		const shortestColumnIndex = columnsHeight.indexOf(Math.min(...columnsHeight));
		columns[shortestColumnIndex].push(img);
		// Here we actually add aspect ratio rather than height since design is responsive
		columnsHeight[shortestColumnIndex] += aspectRatio;
	}
	return columns;
}

export default GifList;
