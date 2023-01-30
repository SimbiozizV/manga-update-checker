import * as cheerio from 'cheerio';
import { ParsedData } from '../types/ParsedData';

export default (html: string): ParsedData | null => {
    const $ = cheerio.load(html);

    try {
        const title = $('.rus-name').text();
        const url = $('.read-ch-online').attr('href');
        const lastChapter = url!.match(/ch\d+/)![0].replace(/[^\d]/g, '');
        return {
            title,
            lastChapter,
        };
    } catch (e) {
        return null;
    }
};
