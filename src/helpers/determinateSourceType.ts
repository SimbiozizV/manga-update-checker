import {SourceType} from '../enum';

export default (url: string): SourceType | null => {
    const { host } = new URL(url);

    switch (host) {
        case 'mangalib.me':
            return SourceType.MangaLib;
        case 'acomics.ru':
            return SourceType.AK;
        case 'desu.me':
            return SourceType.Desu;
        case 'readmanga.live':
        case 'mintmanga.live':
        case 'selfmanga.live':
            return SourceType.ReadManga;
        default:
            return null;
    }
};
