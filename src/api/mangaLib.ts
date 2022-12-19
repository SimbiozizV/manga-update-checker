import makeRequest from './makeRequest';
import { MangaLibSearchResponse } from '../types/search/MangaLib';
import { SearchResultManga } from '../types/search/SearchResultManga';
import { SourceType } from '../enum';

export const searchMangaLibRequest = (name: string): Promise<SearchResultManga[]> => {
    const url = new URL('https://mangalib.me/search');
    url.searchParams.append('type', 'manga');
    url.searchParams.append('q', name);

    return makeRequest<MangaLibSearchResponse>(url.toString()).then(result => {
        return result.map(item => {
            return {
                name: item.rus_name,
                nameEng: item.eng_name,
                thumbnail: item.covers.thumbnail,
                href: item.href,
                source: SourceType.MangaLib,
            };
        });
    });
};
