import makeRequest from './makeRequest';
import { ReadMangaSearchResponse } from '../types/search/ReadManga';
import { SearchResultManga } from '../types/search/SearchResultManga';
import { SourceType } from '../enum';

export const searchReadMangaRequest = async (name: string): Promise<SearchResultManga[]> => {
    const url = new URL('https://readmanga.live/search/suggestion');
    url.searchParams.append('query', name);
    url.searchParams.append('types[]', 'CREATION');

    try {
        const response = await makeRequest<ReadMangaSearchResponse>(url.toString());
        return response.suggestions.map(item => {
            return {
                name: item.value,
                nameEng: item.names.length > 0 ? item.names[0] : '',
                thumbnail: item.thumbnail,
                href: `https://readmanga.live${item.link}`,
                source: SourceType.ReadManga,
            };
        });
    } catch (err) {
        console.log(err);
    }
    return [];
};
