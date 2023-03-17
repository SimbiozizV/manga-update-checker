import { SearchResultManga } from '../types/search/SearchResultManga';
import makeRequest from './makeRequest';
import { RemangaChaptersResponse, RemangaSearchResponse } from '../types/search/Remanga';
import { SourceType } from '../enum';

export const searchRemangaRequest = (name: string): Promise<SearchResultManga[]> => {
    const url = new URL('https://api.xn--80aaig9ahr.xn--c1avg/api/search/');
    url.searchParams.append('query', name);
    url.searchParams.append('count', '5');
    url.searchParams.append('field', 'titles');

    return makeRequest<RemangaSearchResponse>(url.toString()).then(response => {
        const result: SearchResultManga[] = [];
        if (response.content) {
            response.content.forEach(manga => {
                result.push({
                    name: manga.rus_name,
                    nameEng: manga.en_name,
                    thumbnail: `https://api.xn--80aaig9ahr.xn--c1avg/${manga.img.mid}`,
                    href: `https://xn--80aaig9ahr.xn--c1avg/manga/${manga.dir}`,
                    source: SourceType.Remanga,
                });
            });
        }
        return result;
    });
};

export const getRemangaChaptersRequest = (id: number): Promise<string | null> => {
    const url = `https://api.xn--80aaig9ahr.xn--c1avg/api/titles/chapters/?branch_id=${id}&ordering=-index&user_data=1&count=40&page=1`;
    return makeRequest<RemangaChaptersResponse>(url, {
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => {
        if (response.content.length) {
            const freeChapters = response.content.filter(manga => !manga.is_paid);
            return freeChapters.length ? response.content.filter(manga => !manga.is_paid)[0].chapter : null;
        }
        return null;
    });
};
