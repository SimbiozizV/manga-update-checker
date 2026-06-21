export enum SourceType {
    ReadManga = 'readManga',
    MangaLib = 'mangaLib',
    AK = 'acomics',
    Desu = 'desu',
    Remanga = 'remanga',
    MangaOvh = 'mangaOvh',
    MegaBuff = 'mangabuff',
    Inkstory = 'inkstory',
}

export enum MangaStatus {
    Success,
    Error,
}

export enum Route {
    Root = '/',
    MangaList = '/list',
    Search = '/search',
    AddManga = '/add',
}
