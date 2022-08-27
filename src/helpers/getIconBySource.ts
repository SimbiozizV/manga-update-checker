import { SourceType } from '../enum';
import mangaLibIcon from '../icons/mangaLib.png';
import readMangaIcon from '../icons/readmanga.png';
import acomicsIcon from '../icons/acomics.png';

const iconMap: Record<SourceType, string> = {
    [SourceType.ReadManga]: readMangaIcon,
    [SourceType.MangaLib]: mangaLibIcon,
    [SourceType.AK]: acomicsIcon,
};

export default (source: SourceType): string => iconMap[source];
