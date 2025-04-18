import { SourceType } from '../enum';
import { getParserBySourceType } from '../helpers';

export default async ({ url, source }: { url: string; source: SourceType }) => {
    try {
        const parser = getParserBySourceType(source);
        const data = await parser(url);
        return { url, source, data };
    } catch (e) {
        console.error(e);
        return { url, source, data: null };
    }
};
