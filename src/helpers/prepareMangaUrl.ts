import determinateSourceType from './determinateSourceType';
import { SourceType } from '../enum';

export default (url: string): string => {
    const type = determinateSourceType(url);

    if (type && type === SourceType.MangaLib) {
        const urlObj = new URL(url);
        urlObj.searchParams.set('section', 'chapters');
        return urlObj.toString();
    }

    return url;
};
