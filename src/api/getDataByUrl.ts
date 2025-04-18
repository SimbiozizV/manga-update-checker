import { SourceType } from '../enum';
import { getParserBySourceType } from '../helpers';
import makeRequest from './makeRequest';

export default async ({ url, source }: { url: string; source: SourceType }) => {
    try {
        const html = await makeRequest<string>(url, { stringType: true });
        const data = await getParserBySourceType(source)(html);
        return { url, source, data };
    } catch (e) {
        console.error(e);
        return { url, source, data: null };
    }
};
