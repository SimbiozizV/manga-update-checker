import { SourceType } from '../enum';
import { Parser } from '../types/Parser';
import readMangaParser from '../parsers/readMangaParser';
import mangaLibParser from '../parsers/mangaLibParser';
import akParser from '../parsers/akParser';

const parserMap: Record<SourceType, Parser> = {
    [SourceType.ReadManga]: readMangaParser,
    [SourceType.MangaLib]: mangaLibParser,
    [SourceType.AK]: akParser,
};

export default (source: SourceType): Parser => {
    return parserMap[source];
};
