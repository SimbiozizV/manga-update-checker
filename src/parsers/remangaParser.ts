import * as cheerio from 'cheerio';
import { ParsedData } from '../types/ParsedData';
import { getRemangaChaptersRequest } from '../api/remanga';

export default async (html: string): Promise<ParsedData | null> => {
    const $ = cheerio.load(html);

    try {
        const data = JSON.parse($('#__NEXT_DATA__').text());
        const pageInfo = data.props.pageProps.fallbackData.content;
        const lastChapter = await getRemangaChaptersRequest(pageInfo.branches[0].id);

        return lastChapter ? { title: pageInfo.rus_name, lastChapter } : null;
    } catch (e) {
        return null;
    }
};
