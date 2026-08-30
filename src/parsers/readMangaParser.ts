import * as cheerio from 'cheerio';
import httpClient from '../api/httpClient';
import { AsyncParser } from '../types/Parser';

const readMangaParser: AsyncParser = async (url: string) => {
    const html = await httpClient<string>(url, { stringType: true });
    const $ = cheerio.load(html);

    const lastChapterButton = $('.read-last-chapter');

    if (lastChapterButton) {
        const lastUrl = lastChapterButton.attr('href')!;
        const lastChapter = lastUrl.split('/').pop()!;
        const image = $('.picture-fotorama img')[0].attribs.src;
        const title = $('meta[itemprop="name"]').attr('content')!;

        return {
            title,
            image,
            lastChapter,
        };
    }

    return null;
};

export default readMangaParser;
