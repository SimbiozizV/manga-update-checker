import * as cheerio from 'cheerio';
import makeRequest from '../api/makeRequest';
import { AsyncParser } from '../types/Parser';

type InkstoryTab = [number, { text?: [unknown, string]; counter?: [unknown, string] }];
type InkstoryProps = {
    tabs?: [unknown, InkstoryTab[]];
};

const inkstoryParser: AsyncParser = async (url: string) => {
    const html = await makeRequest<string>(url, { stringType: true });
    const $ = cheerio.load(html);

    try {
        const title = $('h1').text().trim();
        const image = $('meta[name="og:image"]').attr('content')!;

        const block = $('astro-island[props*="Главы"]').attr('props');
        if (!block) throw new Error('No block with chapters');

        const propsObj = JSON.parse(block) as InkstoryProps;
        const tabs = propsObj.tabs?.[1] ?? [];

        const lastChapter = tabs.find(tab => tab[1]?.text?.[1] === 'Главы')?.[1]?.counter?.[1] || '0';

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

export default inkstoryParser;
