import * as cheerio from 'cheerio';
import makeRequest from '../api/makeRequest';
import { ParsedData } from '../types/ParsedData';
import { AsyncParser } from '../types/Parser';

const mangaOvhParser: AsyncParser = async (url: string): Promise<ParsedData | null> => {
    const html = await makeRequest<string>(url, { stringType: true });
    const $ = cheerio.load(html);

    try {
        const poster = $('main').find('img');
        if (!poster) throw new Error('No poster');

        const image = poster.attr('src');
        const title = poster.attr('alt');
        const lastChapter = $('div.rounded-full').text();

        if (!image || !title || !lastChapter) throw new Error('No data');

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

export default mangaOvhParser;
