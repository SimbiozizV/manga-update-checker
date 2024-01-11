import * as cheerio from 'cheerio';
import { Parser } from '../types/Parser';

const desuParser: Parser = (html: string) => {
    const $ = cheerio.load(html);

    try {
        const title = $('.rus-name').text();
        const url = $('.read-ch-online').attr('href');
        const image = $('.c-poster img').attr('src')!;
        const lastChapter = url!.match(/ch\d+/)![0].replace(/[^\d]/g, '');
        return {
            title,
            image: image ? `https://desu.me${image}` : '',
            lastChapter,
        };
    } catch (e) {
        return null;
    }
};

export default desuParser;
