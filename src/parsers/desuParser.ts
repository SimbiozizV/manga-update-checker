import * as cheerio from 'cheerio';
import makeRequest from '../api/makeRequest';
import { AsyncParser } from '../types/Parser';

const desuParser: AsyncParser = async (url: string) => {
    const html = await makeRequest<string>(url, { stringType: true });
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
        console.error(e);
        return null;
    }
};

export default desuParser;
