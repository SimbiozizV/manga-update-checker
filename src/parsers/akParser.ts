import { ParsedData } from '../types/ParsedData';

export default (html: string): ParsedData | null => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    try {
        const title = doc.querySelector('meta[property="og:title"]')!.getAttribute('content')!;
        const lastChapter = doc.querySelector('.issueNumber')!.innerHTML.split('/')[1];

        return {
            title,
            lastChapter,
        };
    } catch (e) {
        return null;
    }
};
