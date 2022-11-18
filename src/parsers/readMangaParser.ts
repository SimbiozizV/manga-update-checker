import { ParsedData } from '../types/ParsedData';

export default (html: string): ParsedData | null => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const lastChapterButton = doc.querySelector('.read-last-chapter');

    if (lastChapterButton) {
        const lastUrl = lastChapterButton.getAttribute('href')!;
        const lastChapter = lastUrl.split('/').pop()!;
        const title = doc.querySelector('meta[itemprop="name"]')!.getAttribute('content')!;

        return {
            title,
            lastChapter,
        };
    }

    return null;
};
