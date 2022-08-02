import { SourceType } from '../enum';
import mangaLibIcon from '../icons/mangaLib.png';
import readMangaIcon from '../icons/readmanga.png';

const iconMap: Record<SourceType, string> = {
    [SourceType.ReadManga]: readMangaIcon,
    [SourceType.MangaLib]: mangaLibIcon,
};

export default (source: SourceType): string => iconMap[source];
