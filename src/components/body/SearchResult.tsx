import React, { useContext, useEffect, useState, useCallback } from 'react';
import TenorContext from '../../context/TenorContext';
import { TenorImage } from '../../types/exposedTypes';
import GifList from './GifList';

export interface SearchResultProps {
  searchTerm: string;
  columnsCount: number;
}

function SearchResult({ searchTerm, columnsCount }: SearchResultProps) {
	const [ searchResult, setSearchResult ] = useState<TenorImage[]>([]);
	const [ isLoading, setLoading ] = useState(true);
	const [ nextPos, setNextPos ] = useState<string | null>(null);
	const tenor = useContext(TenorContext);

	const fetchGifs = useCallback(async (pos?: string) => {
		const result = await tenor.search(searchTerm, 50, pos);
		setSearchResult(prevResults => [ ...prevResults, ...result.images ]);
		setNextPos(result.next);
		setLoading(false);
	}, [ searchTerm, tenor ]);

	useEffect(() => {
		setLoading(true);
		setSearchResult([]);
		setNextPos(null);
		const debounce = setTimeout(() => fetchGifs(), 800);
		return (): void => clearTimeout(debounce);
	}, [ searchTerm, fetchGifs ]);

	const handleLoadMore = useCallback(() => {
		if (nextPos) {
			fetchGifs(nextPos);
		}
	}, [ nextPos, fetchGifs ]);

	return (
		<GifList
			isLoading={isLoading}
			columnsCount={columnsCount}
			images={searchResult}
			searchTerm={searchTerm}
			onLoadMore={handleLoadMore}
			hasMore={!!nextPos}
		/>
	);
}

export default SearchResult;
