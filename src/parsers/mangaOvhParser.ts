import * as cheerio from 'cheerio';
import { Parser } from '../types/Parser';
import { ParsedData } from '../types/ParsedData';

const mangaOvhParser: Parser = html => {
    const $ = cheerio.load(html);

    try {
        let result: ParsedData | null = null;
        const scripts = $('script');
        const sourceScript = Array.from(scripts.contents()).find(el => {
            return $(el).text().includes('remixContext');
        });

        if (!sourceScript) return null;

        const parserData = JSON.parse($(sourceScript).text().replace('window.__remixContext = ', '').replace(/;/g, ''));
        const data = parserData.state.loaderData['routes/reader/book/$slug/index'];
        const image = $('meta[property="og:image"]').attr('content')!;

        result = {
            title: data.book.name.ru,
            image,
            lastChapter: data.chapters.reduce((acc: number, item: { number: number }) => {
                return Math.max(acc, item.number);
            }, 0),
        };

        return result;
    } catch (e) {
        return null;
    }
};

export default mangaOvhParser;
