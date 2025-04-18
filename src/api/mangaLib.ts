import { SourceType } from '../enum';
import { MangaLibSearchResponse } from '../types/search/MangaLib';
import { SearchResultManga } from '../types/search/SearchResultManga';
import makeRequest from './makeRequest';

export const searchMangaLibRequest = async (name: string): Promise<SearchResultManga[]> => {
    const url = new URL('https://mangalib.me/search');
    url.searchParams.append('type', 'manga');
    url.searchParams.append('q', name);

    try {
        const response = await makeRequest<MangaLibSearchResponse>(url.toString());
        return response.map(item => {
            return {
                name: item.rus_name,
                nameEng: item.eng_name,
                thumbnail: item.covers.thumbnail,
                href: item.href,
                source: SourceType.MangaLib,
            };
        });
    } catch (e) {
        console.error(e);
    }

    return [];
};
