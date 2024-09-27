import React, { useContext, useEffect, useState, useCallback } from 'react';
import TenorContext from '../../context/TenorContext';
import GifList from './GifList';
import { TenorImage } from '../../types/exposedTypes';

export interface TrendingResultProps {
	columnsCount: number;
}

function TrendingResult({ columnsCount }: TrendingResultProps) {
	const [trendingResult, setSearchResult] = useState<TenorImage[]>([]); // Changed to array for infinite loading
	const [isLoading, setLoading] = useState(true);
	const [nextPos, setNextPos] = useState<string | null>(null); // State for next position
	const tenor = useContext(TenorContext);

	const fetchTrendingGifs = useCallback(async (pos?: string) => {
		const result = await tenor.trending(20, pos); // Pass position to fetch more
		setSearchResult(prevResults => [...prevResults, ...result.images]); // Append new results
		setNextPos(result.next);
		setLoading(false);
	}, [tenor]);

	useEffect(() => {
		setLoading(true);
		setSearchResult([]);
		setNextPos(null);
		fetchTrendingGifs(); // Initial fetch
	}, [fetchTrendingGifs]);

	const handleLoadMore = useCallback(() => {
		if (nextPos) {
			fetchTrendingGifs(nextPos); // Fetch more if nextPos is available
		}
	}, [nextPos, fetchTrendingGifs]);

	return (
		<GifList
			columnsCount={columnsCount}
			isLoading={isLoading}
			images={trendingResult}
			onLoadMore={handleLoadMore} // Add onLoadMore prop
			hasMore={!!nextPos} // Add hasMore prop
		/>
	);
}

export default TrendingResult;
