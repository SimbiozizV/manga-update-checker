import { SearchResultManga } from '../types/search/SearchResultManga';
import makeRequest from './makeRequest';
import { RemangaChaptersResponse, RemangaSearchResponse } from '../types/search/Remanga';
import { SourceType } from '../enum';

export const searchRemangaRequest = async (name: string): Promise<SearchResultManga[]> => {
    const url = new URL('https://api.xn--80aaig9ahr.xn--c1avg/api/search/');
    url.searchParams.append('query', name);
    url.searchParams.append('count', '5');
    url.searchParams.append('field', 'titles');
    const result: SearchResultManga[] = [];

    try {
        const response = await makeRequest<RemangaSearchResponse>(url.toString());
        if (!response.content) return result;
        response.content.forEach(manga => {
            result.push({
                name: manga.rus_name,
                nameEng: manga.en_name,
                thumbnail: `https://api.xn--80aaig9ahr.xn--c1avg/${manga.img.mid}`,
                href: `https://xn--80aaig9ahr.xn--c1avg/manga/${manga.dir}`,
                source: SourceType.Remanga,
            });
        });
    } catch (err) {
        console.error(err);
    }
    return result;
};

export const getRemangaChaptersRequest = async (id: number): Promise<string | null> => {
    const url = `https://api.xn--80aaig9ahr.xn--c1avg/api/titles/chapters/?branch_id=${id}&ordering=-index&user_data=1&count=100&page=1`;

    try {
        const response = await makeRequest<RemangaChaptersResponse>(url, {
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.content.length) return null;
        const freeChapters = response.content.filter(manga => !manga.is_paid);
        return freeChapters.length ? response.content.filter(manga => !manga.is_paid)[0].chapter : null;
    } catch (err) {
        console.error(err);
    }

    return null;
};
