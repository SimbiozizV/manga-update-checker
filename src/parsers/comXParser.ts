import * as cheerio from 'cheerio';
import httpClient from '../api/httpClient';
import { AsyncParser } from '../types/Parser';

type ComXChapter = {
    number: number;
};

type ComXData = {
    title?: string;
    chapters?: ComXChapter[];
};

const resolveImage = (image: string | undefined, origin: string): string => {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    return `${origin}${image.startsWith('/') ? '' : '/'}${image}`;
};

const parseComXData = (html: string): ComXData | null => {
    const match = html.match(/window\.__DATA__\s*=\s*(\{[\s\S]*?\});/);
    if (!match) return null;

    try {
        return JSON.parse(match[1]) as ComXData;
    } catch (e) {
        console.error(e);
        return null;
    }
};

const parseLastChapterFromJsonLd = ($: cheerio.CheerioAPI): string | null => {
    const scripts = $('script[type="application/ld+json"]');

    for (const script of scripts) {
        try {
            const data = JSON.parse($(script).text());
            const graph = data['@graph'] ?? [data];

            for (const item of graph) {
                if (item['@type'] !== 'ComicSeries') continue;

                const firstChapter = item.hasPart?.itemListElement?.[0]?.item;
                const issueNumber = firstChapter?.issueNumber;

                if (issueNumber != null) {
                    return String(parseFloat(issueNumber));
                }
            }
        } catch {
            continue;
        }
    }

    return null;
};

const comXParser: AsyncParser = async (url: string) => {
    const pageUrl = url.split('#')[0];
    const html = await httpClient<string>(pageUrl, { stringType: true });
    const $ = cheerio.load(html);
    const { origin } = new URL(pageUrl);

    try {
        const data = parseComXData(html);
        const title = ($('h1').text().trim() || data?.title)!;
        const image = resolveImage($('meta[property="og:image"]').attr('content'), origin);
        const latestChapter = data?.chapters?.[0];

        if (latestChapter?.number != null) {
            return {
                title,
                image,
                lastChapter: String(latestChapter.number),
            };
        }

        const lastChapter = parseLastChapterFromJsonLd($);

        if (lastChapter) {
            return { title, image, lastChapter };
        }

        return null;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export default comXParser;
