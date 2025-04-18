import { SourceType } from '../enum';
import { MangaOvhSearchResponse } from '../types/search/MangaOvh';
import { SearchResultManga } from '../types/search/SearchResultManga';
import makeRequest from './makeRequest';

export const searchMangaOvh = async (name: string): Promise<SearchResultManga[]> => {
    const url = new URL('https://api.manga.ovh/search/book');
    url.searchParams.append('query', name);
    url.searchParams.append('size', '20');

    try {
        const response = await makeRequest<MangaOvhSearchResponse>(url.toString());
        if (!response.length) return [];
        return response.map(({ name, poster, slug }) => {
            return {
                name: name.ru,
                nameEng: name.en,
                thumbnail: poster,
                href: `https://manga.ovh/manga/${slug}`,
                source: SourceType.MangaOvh,
            };
        });
    } catch (e) {
        console.error(e);
    }
    return [];
};
