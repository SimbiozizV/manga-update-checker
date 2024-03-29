import * as cheerio from 'cheerio';
import { Parser } from '../types/Parser';

const akParser: Parser = html => {
    const $ = cheerio.load(html);

    try {
        const title = $('meta[property="og:title"]').attr('content')!;
        const image = $('meta[property="og:image"]').attr('content')!;
        const lastChapter = $('.button-goto')!.text().split('/')[1];

        return {
            title,
            image: image ? `https://acomics.ru${image}` : '',
            lastChapter,
        };
    } catch (e) {
        return null;
    }
};

export default akParser;
