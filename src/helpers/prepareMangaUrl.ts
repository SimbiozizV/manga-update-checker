import determinateSourceType from './determinateSourceType';
import { SourceType } from '../enum';

export default (url: string): string => {
    const type = determinateSourceType(url);

    const urlObj = new URL(url);
    const splitPath = urlObj.pathname.replace(/^\//, '').split('/');

    if (type === SourceType.AK || type === SourceType.ReadManga) {
        return `${urlObj.origin}/${splitPath[0]}`;
    }

    if (type === SourceType.MangaLib) {
        return `${urlObj.origin}/${splitPath[0]}?section=chapters`;
    }

    if (type === SourceType.Desu) {
        return `${urlObj.origin}/manga/${splitPath[1]}`;
    }

    if (type === SourceType.Remanga) {
        return `${urlObj.origin}/manga/${splitPath[1]}?p=content`;
    }

    return url;
};
