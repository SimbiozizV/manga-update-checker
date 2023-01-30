import * as cheerio from 'cheerio';
import { ParsedData } from '../types/ParsedData';

export default (html: string): ParsedData | null => {
    const $ = cheerio.load(html);
    const lastChapterButton = $('.read-last-chapter');

    if (lastChapterButton) {
        const lastUrl = lastChapterButton.attr('href')!;
        const lastChapter = lastUrl.split('/').pop()!;
        const title = $('meta[itemprop="name"]').attr('content')!;

        return {
            title,
            lastChapter,
        };
    }

    return null;
};
