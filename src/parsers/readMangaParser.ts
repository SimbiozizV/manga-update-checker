import { ParsedData } from '../types/ParsedData';

export default (html: string): ParsedData | null => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const table = doc.getElementById('chapters-list');

    if (table) {
        const lastUrl = table.querySelector('td a')!.getAttribute('href')!;
        const lastChapter = lastUrl.split('/').pop()!;
        const title = doc.querySelector('meta[itemprop="name"]')!.getAttribute('content')!;

        return {
            title,
            lastChapter,
        };
    }

    return null;
};
