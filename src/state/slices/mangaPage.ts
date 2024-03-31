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
    showMangaNotification,
} from '../../helpers';
import MangaStorage from '../../class/MangaStorage';
import { STORAGE_KEY } from '../../constants';
import { ADD_MANGA_TEXT, IMPORT_MANGA_TEXT, UPDATE_MANGA_TEXT } from '../../constants/text';
import { MangaStatus } from '../../enum';
import { ExportItem } from '../../types/ExportItem';

const mangaStorage = new MangaStorage(STORAGE_KEY);

const initialState: Store['mangaPage'] = {
    manga: [],
    filter: '',
    isUpdating: false,
    isAdding: false,
    isImported: false,
};

const slice = createSlice({
    name: 'mangaPage',
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

export const selectManga = (state: Store) => state.mangaPage.manga;
export const selectFilter = (state: Store) => state.mangaPage.filter;
export const selectIsImported = (state: Store) => state.mangaPage.isImported;
export const selectIsAdding = (state: Store) => state.mangaPage.isImported;
export const selectIsUpdating = (state: Store) => state.mangaPage.isUpdating;

export const importFile =
    (importList: ExportItem[]): ThunkAction<void, Store, undefined, Action> =>
    async (dispatch, getState) => {
        const { manga } = getState().mangaPage;

        dispatch(setImportingAction(true));
        try {
            const newManga = importList.filter(({ url }) => manga.findIndex(i => i.url === url) === -1);

            if (!newManga.length) {
                dispatch(setImportingAction(false));
                message.warning(IMPORT_MANGA_TEXT.noNew);
                return;
            }

            if (newManga.length !== importList.length) {
                message.warning(IMPORT_MANGA_TEXT.alreadyExist);
            }

            const response = await Promise.allSettled(
                newManga.map(({ url, source }) => getDataByUrl(url, getParserBySourceType(source)))
            );

            const result = response.reduce<Manga[]>((acc, mangaItem, index) => {
                if (mangaItem.status === 'fulfilled' && mangaItem.value) {
                    acc.push({
                        url: newManga[index].url,
                        title: mangaItem.value.title,
                        image: mangaItem.value.image,
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
            await mangaStorage.setMangaList(updatedList);

            if (newManga.length !== result.length) {
                message.error(IMPORT_MANGA_TEXT.error);
            } else {
                message.success(IMPORT_MANGA_TEXT.success);
            }
        } catch (error) {
            message.error(IMPORT_MANGA_TEXT.error);
        } finally {
            dispatch(setImportingAction(false));
        }
    };

export const updateManga = async (manga: Manga): Promise<Manga> => {
    const response = await getDataByUrl(manga.url, getParserBySourceType(manga.source));

    return response
        ? {
              ...manga,
              prevChapter: manga.lastChapter,
              image: response.image,
              lastChapter: response.lastChapter,
              status: MangaStatus.Success,
          }
        : { ...manga, status: MangaStatus.Error };
};

export const checkMangaUpdate = (): ThunkAction<void, Store, undefined, Action> => async (dispatch, getState) => {
    const { manga } = getState().mangaPage;

    dispatch(setUpdatingAction(true));
    try {
        const response = await Promise.allSettled(manga.map(updateManga));

        let hasProblem = false;
        let newChapterCount = 0;

        const result = response.reduce<Manga[]>((acc, mangaItem, key) => {
            if (mangaItem.status === 'fulfilled') {
                if (manga[key].lastChapter !== mangaItem.value.lastChapter) newChapterCount++;
                acc.push({
                    ...manga[key],
                    image: mangaItem.value.image,
                    lastChapter: mangaItem.value.lastChapter,
                    status: mangaItem.value.status,
                });
            } else {
                hasProblem = true;
                acc.push({ ...manga[key], status: MangaStatus.Error });
            }
            return acc;
        }, []);

        dispatch(setMangaArrayAction(result));
        await mangaStorage.setMangaList(result);

        if (hasProblem) {
            message.warning(UPDATE_MANGA_TEXT.error);
        } else {
            message.success(UPDATE_MANGA_TEXT.success(newChapterCount));
        }
        setExtensionIconMode(newChapterCount);
    } catch (error) {
        message.warning(UPDATE_MANGA_TEXT.error);
    } finally {
        dispatch(setUpdatingAction(false));
    }
};

export const addManga =
    (url: string): ThunkAction<void, Store, undefined, Action> =>
    async (dispatch, getState) => {
        const { manga } = getState().mangaPage;
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
        try {
            const response = await getDataByUrl(fixedUrl, getParserBySourceType(source));
            if (!response) {
                message.error(ADD_MANGA_TEXT.error);
                return;
            }

            const newList = [...manga];
            newList.push({
                url: fixedUrl,
                title: response.title,
                image: response.image,
                prevChapter: response.lastChapter,
                lastChapter: response.lastChapter,
                status: MangaStatus.Success,
                source,
            });

            dispatch(setMangaArrayAction(newList));
            await mangaStorage.saveStorage({ manga: newList });
            message.success(ADD_MANGA_TEXT.success);
        } catch (error) {
            message.error(ADD_MANGA_TEXT.error);
        } finally {
            dispatch(setAddingAction(false));
        }
    };

export const removeManga =
    (url: string): ThunkAction<void, Store, undefined, Action> =>
    async (dispatch, getState) => {
        const { manga } = getState().mangaPage;

        const newList = manga.filter(item => item.url !== url);
        dispatch(setMangaArrayAction(newList));
        await mangaStorage.saveStorage({ manga: newList });
    };

export const readManga =
    (url: string): ThunkAction<void, Store, undefined, Action> =>
    async (dispatch, getState) => {
        const { manga } = getState().mangaPage;

        const index = manga.findIndex(i => i.url === url);
        if (index === -1) return;

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

        await mangaStorage.saveStorage({ manga: newList });
        await showMangaNotification(manga[index]);
        await chrome.tabs.create({ url, active: true });
    };

export default slice.reducer;
