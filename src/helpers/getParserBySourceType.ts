import { SourceType } from '../enum';
import akParser from '../parsers/akParser';
import comXParser from '../parsers/comXParser';
import desuParser from '../parsers/desuParser';
import inkstoryParser from '../parsers/inkstoryParser';
import mangaBuffParser from '../parsers/mangaBuffParser';
import { mangaLibParser } from '../parsers/mangaLibParser';
import mangaOvhParser from '../parsers/mangaOvhParser';
import readMangaParser from '../parsers/readMangaParser';
import remangaParser from '../parsers/remangaParser';
import { AsyncParser, Parser } from '../types/Parser';

const parserMap: Record<SourceType, Parser | AsyncParser> = {
    [SourceType.ReadManga]: readMangaParser,
    [SourceType.MangaLib]: mangaLibParser,
    [SourceType.AK]: akParser,
    [SourceType.Desu]: desuParser,
    [SourceType.Remanga]: remangaParser,
    [SourceType.MangaOvh]: mangaOvhParser,
    [SourceType.Inkstory]: inkstoryParser,
    [SourceType.ComX]: comXParser,
    [SourceType.MangaBuff]: mangaBuffParser,
};

export default (source: SourceType): Parser | AsyncParser => {
    return parserMap[source];
};
