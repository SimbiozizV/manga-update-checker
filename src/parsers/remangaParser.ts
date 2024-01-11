import * as cheerio from 'cheerio';
import { ParsedData } from '../types/ParsedData';
import { getRemangaChaptersRequest } from '../api/remanga';
import { AsyncParser } from '../types/Parser';

const remangaParser: AsyncParser = async html => {
    const $ = cheerio.load(html);

    try {
        const data = JSON.parse($('#__NEXT_DATA__').text());
        const pageInfo = data.props.pageProps.fallbackData.content;
        const image = $('meta[property="og:image"]').attr('content')!;
        const lastChapter = await getRemangaChaptersRequest(pageInfo.branches[0].id);

        return lastChapter ? { title: pageInfo.rus_name as string, image, lastChapter } : null;
    } catch (e) {
        return null;
    }
};

export default remangaParser;
