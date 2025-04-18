import * as cheerio from 'cheerio';
import makeRequest from '../api/makeRequest';
import { AsyncParser } from '../types/Parser';

const akParser: AsyncParser = async (url: string) => {
    const html = await makeRequest<string>(url, { stringType: true });
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
        console.error(e);
        return null;
    }
};

export default akParser;
