import { SourceType } from '../enum';
import determinateSourceType from './determinateSourceType';

export default (url: string): string => {
    const type = determinateSourceType(url);

    const urlObj = new URL(url);
    const splitPath = urlObj.pathname.replace(/^\//, '').split('/');

    if (type === SourceType.AK || type === SourceType.ReadManga) {
        return `${urlObj.origin}/${splitPath[0]}`;
    }

    if (type === SourceType.MangaLib) {
        return urlObj.origin + urlObj.pathname;
    }

    if (type === SourceType.Desu || type === SourceType.MangaOvh || type === SourceType.MangaBuff) {
        return `${urlObj.origin}/manga/${splitPath[1]}`;
    }

    if (type === SourceType.Remanga) {
        return `${urlObj.origin}/manga/${splitPath[1]}?p=content`;
    }

    if (type === SourceType.ComX) {
        return `${urlObj.origin}${urlObj.pathname}`;
    }

    return url;
};
