import { SearchResultManga } from '../types/search/SearchResultManga';
import makeRequest from './makeRequest';
import { MangaOvhSearchResponse } from '../types/search/MangaOvh';
import { SourceType } from '../enum';

export const searchMangaOvh = (name: string): Promise<SearchResultManga[]> => {
    const url = new URL('https://api.manga.ovh/search/book');
    url.searchParams.append('query', name);
    url.searchParams.append('size', '20');

    return makeRequest<MangaOvhSearchResponse>(url.toString()).then(response => {
        let result: SearchResultManga[] = [];
        if (response.length) {
            result = response.map(({ name, poster, slug }) => {
                return {
                    name: name.ru,
                    nameEng: name.en,
                    thumbnail: poster,
                    href: `https://manga.ovh/manga/${slug}`,
                    source: SourceType.MangaOvh,
                };
            });
        }
        return result;
    });
};
