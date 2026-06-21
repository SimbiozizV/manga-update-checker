import * as cheerio from 'cheerio';
import makeRequest from '../api/makeRequest';
import { getRemangaChaptersRequest } from '../api/remanga';
import { AsyncParser } from '../types/Parser';

type RemangaPageInfo = {
    rus_name: string;
    branches: { id: number }[];
};

type RemangaNextData = {
    props: {
        pageProps: {
            fallbackData: {
                content: RemangaPageInfo;
            };
        };
    };
};

const remangaParser: AsyncParser = async (url: string) => {
    const html = await makeRequest<string>(url, { stringType: true });
    const $ = cheerio.load(html);

    try {
        const data = JSON.parse($('#__NEXT_DATA__').text()) as RemangaNextData;
        const pageInfo = data.props.pageProps.fallbackData.content;
        const image = $('meta[property="og:image"]').attr('content')!;
        const lastChapter = await getRemangaChaptersRequest(pageInfo.branches[0].id);

        return lastChapter ? { title: pageInfo.rus_name, image, lastChapter } : null;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export default remangaParser;
