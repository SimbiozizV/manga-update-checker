import { ParsedData } from '../types/ParsedData';

export default (html: string): ParsedData | null => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    try {
        let dataString = doc.querySelector('script')!.innerHTML.split('window')[1];
        dataString = dataString
            .replace('.__DATA__ = ', '')
            .replace(';', '')
            .replace(/\s{2,}/g, '')
            .replace(/;$/, '');
        const data = JSON.parse(dataString);
        const chapter = data.chapters.list.shift();
        return {
            title: data.manga.rusName,
            lastChapter: chapter.chapter_number,
        };
    } catch (e) {
        return null;
    }
};
