import makeRequest from './makeRequest';
import { AsyncParser, Parser } from '../types/Parser';

export default async (url: string, parser: Parser | AsyncParser) => {
    const html = await makeRequest<string>(url, { stringType: true });
    return parser(html);
};
