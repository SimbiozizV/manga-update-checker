import { SourceType } from '../enum';

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
        case '1.mintmanga.one':
        case 'selfmanga.live':
            return SourceType.ReadManga;
        case 'xn--80aaig9ahr.xn--c1avg':
        case 'remanga.org':
            return SourceType.Remanga;
        case 'manga.ovh':
            return SourceType.MangaOvh;
        default:
            return null;
    }
};
