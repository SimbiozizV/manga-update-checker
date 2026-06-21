import { SourceType } from '../enum';

export default (url: string): SourceType | null => {
    const { host } = new URL(url);

    if (host.includes('mangalib')) {
        return SourceType.MangaLib;
    }

    if (host.includes('acomics')) {
        return SourceType.AK;
    }

    if (host.includes('desu')) {
        return SourceType.Desu;
    }

    if (['readmanga', 'mintmanga', 'selfmanga', 'seimanga'].some(i => host.includes(i))) {
        debugger;
        return SourceType.ReadManga;
    }

    if (['xn--80aaig9ahr.xn--c1avg', 'remanga'].some(i => host.includes(i))) {
        return SourceType.Remanga;
    }

    if (host === 'manga.ovh') {
        return SourceType.MangaOvh;
    }

    if (host.includes('mangabuff')) {
        return SourceType.MegaBuff;
    }

    if (host.includes('inkstory')) {
        return SourceType.Inkstory;
    }

    return null;
};
