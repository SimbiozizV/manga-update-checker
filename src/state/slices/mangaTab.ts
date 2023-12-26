import { Store } from '../../types/Store';
import { Action, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { Manga } from '../../types/Manga';
import { message } from 'antd';
import getDataByUrl from '../../api/getDataByUrl';
import {
    determinateSourceType,
    getNewChaptersCount,
    getParserBySourceType,
    prepareMangaUrl,
    setExtensionIconMode,
} from '../../helpers';
import MangaStorage from '../../class/MangaStorage';
import { STORAGE_KEY } from '../../constants';
import { ADD_MANGA_TEXT, IMPORT_MANGA_TEXT, UPDATE_MANGA_TEXT } from '../../constants/text';
import { MangaStatus } from '../../enum';
import { ExportItem } from '../../types/ExportItem';

const mangaStorage = new MangaStorage(STORAGE_KEY);

const initialState: Store['mangaTab'] = {
    manga: [],
    filter: '',
    isUpdating: false,
    isAdding: false,
    isImported: false,
};

const slice = createSlice({
    name: 'mangaTab',
    initialState,
    reducers: {
        setUpdatingAction(store, { payload }: PayloadAction<boolean>) {
            store.isUpdating = payload;
        },
        setFilterAction(store, { payload }: PayloadAction<string>) {
            store.filter = payload;
        },
        setAddingAction(store, { payload }: PayloadAction<boolean>) {
            store.isAdding = payload;
        },
        setImportingAction(store, { payload }: PayloadAction<boolean>) {
            store.isImported = payload;
        },
        setMangaArrayAction(store, { payload }: PayloadAction<Manga[]>) {
            store.manga = payload;
        },
    },
});

export const { setUpdatingAction, setFilterAction, setAddingAction, setMangaArrayAction, setImportingAction } =
    slice.actions;

export const selectManga = (state: Store) => state.mangaTab.manga;
export const selectFilter = (state: Store) => state.mangaTab.filter;
export const selectIsImported = (state: Store) => state.mangaTab.isImported;
export const selectIsAdding = (state: Store) => state.mangaTab.isImported;
export const selectIsUpdating = (state: Store) => state.mangaTab.isUpdating;

export const importFile =
    (importList: ExportItem[]): ThunkAction<void, Store, undefined, Action> =>
    (dispatch, getState) => {
        const { manga } = getState().mangaTab;

        dispatch(setImportingAction(true));
        const newManga = importList.filter(({ url }) => manga.findIndex(i => i.url === url) === -1);

        if (newManga.length) {
            if (newManga.length !== importList.length) {
                message.warning(IMPORT_MANGA_TEXT.alreadyExist);
            }

            Promise.allSettled(
                newManga.map(({ url, source }) => getDataByUrl(url, getParserBySourceType(source)))
            ).then(data => {
                const result = data.reduce<Manga[]>((acc, mangaItem, index) => {
                    if (mangaItem.status === 'fulfilled' && mangaItem.value) {
                        acc.push({
                            url: newManga[index].url,
                            title: mangaItem.value.title,
                            prevChapter: newManga[index].prevChapter,
                            lastChapter: mangaItem.value.lastChapter,
                            status: MangaStatus.Success,
                            source: newManga[index].source,
                        });
                    }
                    return acc;
                }, []);

                const updatedList = [...manga, ...result];

                setExtensionIconMode(getNewChaptersCount(updatedList));
                dispatch(setMangaArrayAction(updatedList));
                mangaStorage.setMangaList(updatedList);

                if (newManga.length !== result.length) {
                    message.error(IMPORT_MANGA_TEXT.error);
                } else {
                    message.success(IMPORT_MANGA_TEXT.success);
                }
                dispatch(setImportingAction(false));
            });
        } else {
            dispatch(setImportingAction(false));
            message.warning(IMPORT_MANGA_TEXT.noNew);
        }
    };

export const updateManga = (manga: Manga): Promise<Manga> => {
    return getDataByUrl(manga.url, getParserBySourceType(manga.source)).then(data => {
        return data
            ? { ...manga, prevChapter: manga.lastChapter, lastChapter: data.lastChapter, status: MangaStatus.Success }
            : { ...manga, status: MangaStatus.Error };
    });
};

export const checkMangaUpdate = (): ThunkAction<void, Store, undefined, Action> => (dispatch, getState) => {
    const { manga } = getState().mangaTab;

    dispatch(setUpdatingAction(true));
    Promise.allSettled(manga.map(updateManga))
        .then(updatedManga => {
            let hasProblem = false;
            let newChapterCount = 0;

            const result = updatedManga.reduce<Manga[]>((acc, mangaItem, key) => {
                if (mangaItem.status === 'fulfilled') {
                    if (manga[key].lastChapter !== mangaItem.value.lastChapter) newChapterCount++;
                    acc.push({
                        ...manga[key],
                        lastChapter: mangaItem.value.lastChapter,
                        status: mangaItem.value.status,
                    });
                } else {
                    hasProblem = true;
                    acc.push(manga[key]);
                }
                return acc;
            }, []);

            dispatch(setMangaArrayAction(result));
            mangaStorage.setMangaList(result);

            if (hasProblem) {
                message.warning(UPDATE_MANGA_TEXT.error);
            } else {
                message.success(UPDATE_MANGA_TEXT.success(newChapterCount));
            }
            setExtensionIconMode(newChapterCount);
        })
        .finally(() => {
            dispatch(setUpdatingAction(false));
        });
};

export const addManga =
    (url: string): ThunkAction<void, Store, undefined, Action> =>
    (dispatch, getState) => {
        const { manga } = getState().mangaTab;
        const fixedUrl = prepareMangaUrl(url);
        const source = determinateSourceType(fixedUrl);

        if (!source) {
            message.warning(ADD_MANGA_TEXT.notSupported);
            return;
        }

        if (manga.findIndex(i => i.url === fixedUrl) > -1) {
            message.warning(ADD_MANGA_TEXT.alreadyExist);
            return;
        }

        dispatch(setAddingAction(true));
        getDataByUrl(fixedUrl, getParserBySourceType(source))
            .then(data => {
                if (data) {
                    const newList = [...manga];
                    newList.push({
                        url: fixedUrl,
                        title: data.title,
                        prevChapter: data.lastChapter,
                        lastChapter: data.lastChapter,
                        status: MangaStatus.Success,
                        source,
                    });

                    dispatch(setMangaArrayAction(newList));
                    mangaStorage.saveStorage({ manga: newList });
                    message.success(ADD_MANGA_TEXT.success);
                } else {
                    message.error(ADD_MANGA_TEXT.error);
                }
            })
            .finally(() => {
                dispatch(setAddingAction(false));
            });
    };

export const removeManga =
    (url: string): ThunkAction<void, Store, undefined, Action> =>
    (dispatch, getState) => {
        const { manga } = getState().mangaTab;

        const newList = manga.filter(item => item.url !== url);
        dispatch(setMangaArrayAction(newList));
        mangaStorage.saveStorage({ manga: newList });
    };

export const onRedirectByLink =
    (url: string): ThunkAction<void, Store, undefined, Action> =>
    (dispatch, getState) => {
        const { manga } = getState().mangaTab;

        const index = manga.findIndex(i => i.url === url);
        if (index > -1) {
            const { newList, newChaptersCount } = manga.reduce<{ newList: Manga[]; newChaptersCount: number }>(
                (acc, manga, key) => {
                    if (key === index) {
                        acc.newList.push({ ...manga, prevChapter: manga.lastChapter });
                    } else {
                        acc.newList.push(manga);
                        if (manga.prevChapter !== manga.lastChapter) {
                            acc.newChaptersCount++;
                        }
                    }
                    return acc;
                },
                { newList: [], newChaptersCount: 0 }
            );
            dispatch(setMangaArrayAction(newList));
            setExtensionIconMode(newChaptersCount);

            mangaStorage.saveStorage({ manga: newList }).then(() => {
                chrome.tabs.create({ url, active: true });
            });
        }
    };

export default slice.reducer;
