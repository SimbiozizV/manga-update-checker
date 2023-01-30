import * as cheerio from 'cheerio';
import { ParsedData } from '../types/ParsedData';

export default (html: string): ParsedData | null => {
    const $ = cheerio.load(html);

    try {
        const title = $('meta[property="og:title"]').attr('content')!;
        const lastChapter = $('.issueNumber')!.text().split('/')[1];

        return {
            title,
            lastChapter,
        };
    } catch (e) {
        return null;
    }
};
