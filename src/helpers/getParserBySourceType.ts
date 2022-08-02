import { SourceType } from '../enum';
import { Parser } from '../types/Parser';
import readMangaParser from '../parsers/readMangaParser';
import mangaLibParser from '../parsers/mangaLibParser';

const parserMap: Record<SourceType, Parser> = {
    [SourceType.ReadManga]: readMangaParser,
    [SourceType.MangaLib]: mangaLibParser,
};

export default (source: SourceType): Parser => {
    return parserMap[source];
};
