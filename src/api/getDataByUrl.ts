import makeRequest from './makeRequest';
import { Manga } from '../types/Manga';

type Parser = (url: string) => Pick<Manga, 'title' | 'lastChapter'> | null;
export default async (url: string, parser: Parser) => {
    const html = await makeRequest(url);
    return parser(html);
};
