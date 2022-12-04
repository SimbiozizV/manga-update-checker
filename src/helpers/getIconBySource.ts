import { SourceType } from '../enum';
import mangaLibIcon from '../icons/mangaLib.png';
import readMangaIcon from '../icons/readmanga.png';
import acomicsIcon from '../icons/acomics.png';
import desuIcon from '../icons/desu.png';

const iconMap: Record<SourceType, string> = {
    [SourceType.ReadManga]: readMangaIcon,
    [SourceType.MangaLib]: mangaLibIcon,
    [SourceType.AK]: acomicsIcon,
    [SourceType.Desu]: desuIcon,
};

export default (source: SourceType): string => iconMap[source];
