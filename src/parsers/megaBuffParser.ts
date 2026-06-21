import { AsyncParser } from '../types/Parser';
import makeRequest from '../api/makeRequest';
import * as cheerio from 'cheerio';

export const megaBuffParser: AsyncParser = async (url: string) => {
    const html = await makeRequest<string>(url, { stringType: true });
    const $ = cheerio.load(html);

    const lastChapterButton = $('button[data-page="chapters"]');

    if (lastChapterButton) {
        const { origin } = new URL(url);
        const result = lastChapterButton.text().match(/\w+/g);
        if (!result) return null;

        const lastChapter = result[0];
        const title = $('.manga__name').text();
        const image = $('.manga__img img')?.[0]?.attribs.src;

        return {
            title,
            image: origin + image,
            lastChapter,
        };
    }

    return null;
};
