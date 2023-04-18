import { SourceType } from '../enum';
import { Parser } from '../types/Parser';
import readMangaParser from '../parsers/readMangaParser';
import mangaLibParser from '../parsers/mangaLibParser';
import akParser from '../parsers/akParser';
import desuParser from '../parsers/desuParser';
import remangaParser from '../parsers/remangaParser';
import mangaOvhParser from '../parsers/mangaOvhParser';

const parserMap: Record<SourceType, Parser> = {
    [SourceType.ReadManga]: readMangaParser,
    [SourceType.MangaLib]: mangaLibParser,
    [SourceType.AK]: akParser,
    [SourceType.Desu]: desuParser,
    [SourceType.Remanga]: remangaParser,
    [SourceType.MangaOvh]: mangaOvhParser,
};

export default (source: SourceType): Parser => {
    return parserMap[source];
};
