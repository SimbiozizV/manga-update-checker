const ALLOWED_HOSTS = [
    'readmanga.live',
    '2.mintmanga.one',
    'selfmanga.live',
    '1.seimanga.me',
    'zz.readmanga.io',
    'web.usagi.one',
    'mangalib.me',
    'mangalib.org',
    'api2.mangalib.me',
    'cover.imglib.info',
    'cover.cdnlibs.org',
    'acomics.ru',
    'desu.me',
    'xn--80aaig9ahr.xn--c1avg',
    'remanga.org',
    'api.xn--80aaig9ahr.xn--c1avg',
    'manga.ovh',
    'api.manga.ovh',
    'inkstory.me',
    'com-x.life',
    'mangabuff.ru',
] as const;

export const HOST_PERMISSIONS = ALLOWED_HOSTS.flatMap(host => [`*://${host}/*`]);

export default ALLOWED_HOSTS;
