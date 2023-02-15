import { SourceType } from '../enum';
import mangaLibIcon from '../icons/mangaLib.png';
import readMangaIcon from '../icons/readmanga.png';
import acomicsIcon from '../icons/acomics.png';
import desuIcon from '../icons/desu.png';
import remangaIcon from '../icons/remanga.png';

const iconMap: Record<SourceType, string> = {
    [SourceType.ReadManga]: readMangaIcon,
    [SourceType.MangaLib]: mangaLibIcon,
    [SourceType.AK]: acomicsIcon,
    [SourceType.Desu]: desuIcon,
    [SourceType.Remanga]: remangaIcon,
};

export default (source: SourceType): string => iconMap[source];
