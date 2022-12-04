import { ParsedData } from '../types/ParsedData';

export default (html: string): ParsedData | null => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    try {
        const title = doc.querySelector('.rus-name')!.innerText;
        const url = doc.querySelector('.read-ch-online')!.getAttribute('href');
        const lastChapter = url!.match(/ch\d+/)![0].replace(/[^\d]/g, '');
        debugger;
        return {
            title,
            lastChapter,
        };
    } catch (e) {
        return null;
    }
};
