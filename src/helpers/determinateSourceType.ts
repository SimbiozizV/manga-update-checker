import { SourceType } from '../enum';

export default (url: string): SourceType | null => {
    const { host } = new URL(url);

    switch (host) {
        case 'mangalib.me':
        case 'mangalib.org':
            return SourceType.MangaLib;
        case 'acomics.ru':
            return SourceType.AK;
        case 'desu.me':
            return SourceType.Desu;
        case 'readmanga.live':
        case '2.mintmanga.one':
        case 'selfmanga.live':
        case '1.seimanga.me':
        case 'zz.readmanga.io':
        case 'web.usagi.one':
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
