import { SourceType } from '../enum';

export default (url: string): SourceType | null => {
    const { host } = new URL(url);

    switch (host) {
        case 'mangalib.me':
            return SourceType.MangaLib;
        case 'readmanga.live':
        case 'mintmanga.live':
        case 'selfmanga.live':
            return SourceType.ReadManga;
        default:
            return null;
    }
};
