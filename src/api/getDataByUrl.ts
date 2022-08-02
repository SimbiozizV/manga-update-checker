import makeRequest from './makeRequest';
import { Parser } from '../types/Parser';

export default async (url: string, parser: Parser) => {
    const html = await makeRequest(url);
    return parser(html);
};
