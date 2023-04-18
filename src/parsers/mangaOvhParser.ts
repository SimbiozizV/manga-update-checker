import * as cheerio from 'cheerio';
import { ParsedData } from '../types/ParsedData';

export default (html: string): ParsedData | null => {
    const $ = cheerio.load(html);

    try {
        let result: ParsedData | null = null;

        const scripts = $('script[type*="-text/javascript"]');
        scripts.each((_, el) => {
            const content = $(el).text();
            if (/__remixContext/.test(content)) {
                const parserData = JSON.parse(content.replace('window.__remixContext = ', '').replace(/;/g, ''));
                const data = parserData.state.loaderData['routes/reader/book/$slug/index'];

                result = {
                    title: data.book.name.ru,
                    lastChapter: data.chapters.reduce((acc, item) => {
                        const listMax = item.list.reduce((a, i) => Math.max(a, i.number), 0);
                        return Math.max(acc, listMax);
                    }, 0),
                };
            }
        });

        return result;
    } catch (e) {
        return null;
    }
};
