import * as cheerio from 'cheerio';
import httpClient from '../api/httpClient';
import { AsyncParser } from '../types/Parser';

const resolveImage = (image: string | undefined, origin: string): string => {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    return `${origin}${image.startsWith('/') ? '' : '/'}${image}`;
};

const mangaBuffParser: AsyncParser = async (url: string) => {
    const html = await httpClient<string>(url, { stringType: true });
    const $ = cheerio.load(html);
    const { origin } = new URL(url);

    try {
        const title = $('.manga__name').first().text().trim() || $('h1').text().trim();
        const image = resolveImage($('meta[property="og:image"]').attr('content'), origin);
        const lastChapter =
            $('.hot-chapters__number').first().text().trim() ||
            $('button.tabs__item[data-page="chapters"]').text().match(/\d+/)?.[0];

        if (!title || !lastChapter) return null;

        return {
            title,
            image,
            lastChapter,
        };
    } catch (e) {
        console.error(e);
        return null;
    }
};

export default mangaBuffParser;
