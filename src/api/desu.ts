import makeRequest from './makeRequest';
import { DesuSearchResponse } from '../types/search/Desu';
import { SearchResultManga } from '../types/search/SearchResultManga';
import { SourceType } from '../enum';

export const searchDesuRequest = (name: string): Promise<SearchResultManga[]> => {
    const url = new URL('https://desu.me/manga/search/');
    url.searchParams.append('q', name);
    return makeRequest<DesuSearchResponse>(url.toString(), { stringType: true }).then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const items = doc.querySelectorAll('.blockLinksList a');

        if (items.length) {
            const result: SearchResultManga[] = [];
            items.forEach(item => {
                const titleElement = item.querySelector('.itemTitle');
                if (titleElement) {
                    result.push({
                        name: item.querySelector('.itemSubTitle').innerText,
                        nameEng: titleElement.innerText,
                        thumbnail: `https://desu.me${item.querySelector('img').getAttribute('src')}`,
                        href: `https://desu.me/${item.getAttribute('href')}`,
                        source: SourceType.Desu,
                    });
                }
            });
            return result;
        }

        return [];
    });
};
