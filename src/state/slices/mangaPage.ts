import { Action, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { md5 } from 'js-md5';
import getDataByUrl from '../../api/getDataByUrl';
import MangaStorage from '../../class/MangaStorage';
import { BATCH_SIZE, STORAGE_KEY } from '../../constants';
import { ADD_MANGA_TEXT, IMPORT_MANGA_TEXT, UPDATE_MANGA_TEXT } from '../../constants/text';
import { MangaStatus, SourceType } from '../../enum';
import {
    determinateSourceType,
    getNewChaptersCount,
    prepareMangaUrl,
    setExtensionIconMode,
    showMangaNotification,
} from '../../helpers';
import { getKeys } from '../../helpers/getKeys';
import { getMaxChapter } from '../../helpers/getMaxChapter';
import { getMaxChapterMirror } from '../../helpers/getMaxChapterMirror';
import { hasNewChapters } from '../../helpers/hasNewChapters';
import { ExportItem } from '../../types/ExportItem';
import { Manga, OldManga } from '../../types/Manga';
import { Store } from '../../types/Store';

type AsyncAction = ThunkAction<void, Store, undefined, Action>;

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
    (importList: ExportItem[]): AsyncAction =>
    async dispatch => {
        dispatch(setImportingAction(true));
        try {
            if (!importList.length) {
                dispatch(setImportingAction(false));
                message.warning(IMPORT_MANGA_TEXT.noNew);
                return;
            }

            const newImportList = importList.map(item => {
                if ('url' in item) {
                    const t = item as unknown as OldManga;
                    return {
                        id: '',
                        prevChapter: t.prevChapter,
                        mirrors: {
                            [t.source]: {
                                url: t.url,
                            },
                        },
                    };
                }
                return item;
            });

            const response = await Promise.all(
                newImportList.map(({ mirrors }) =>
                    Promise.allSettled(
                        getKeys(mirrors).map(source => getDataByUrl({ url: mirrors[source]!.url, source }))
                    )
                )
            );

            const result = response.reduce<Manga[]>((acc, mangaItem, index) => {
                const manga = mangaItem.reduce<Manga>(
                    (acc, mirrorData) => {
                        if (mirrorData.status === 'fulfilled') {
                            const { url, source, data } = mirrorData.value;
                            if (!data) {
                                acc.mirrors[source] = {
                                    url,
                                    status: MangaStatus.Error,
                                    lastChapter: '0',
                                };
                                return acc;
                            }

                            if (!acc.title) acc.title = data.title;
                            if (!acc.id) acc.id = md5(data.title.trim().toLocaleLowerCase());
                            if (!acc.image) acc.image = data.image;

                            acc.mirrors[source] = {
                                url: newImportList[index].mirrors[source]!.url,
                                status: MangaStatus.Success,
                                lastChapter: data.lastChapter.toString(),
                            };
                        }
                        return acc;
                    },
                    {
                        id: newImportList[index].id,
                        title: '',
                        image: '',
                        prevChapter: newImportList[index].prevChapter,
                        mirrors: {},
                    }
                );

                acc.push(manga);

                return acc;
            }, []);

            await setExtensionIconMode(getNewChaptersCount(result));
            dispatch(setMangaArrayAction(result));
            await mangaStorage.setMangaList(result);
            message.success(IMPORT_MANGA_TEXT.success);
        } catch (e) {
            console.error(e);
            message.error(IMPORT_MANGA_TEXT.error);
        } finally {
            dispatch(setImportingAction(false));
        }
    };

export const mirrorUrlChange =
    ({ id, source, url }: { id: string; source: SourceType; url: string }): AsyncAction =>
    async (dispatch, getState) => {
        const mangaList = selectManga(getState());

        const fixedUrl = prepareMangaUrl(url);
        const urlSource = determinateSourceType(fixedUrl);

        if (!urlSource) {
            message.warning(ADD_MANGA_TEXT.notSupported);
            return;
        }

        const response = await getDataByUrl({ url: fixedUrl, source });
        if (!response.data) {
            message.error(ADD_MANGA_TEXT.error);
            return;
        }

        const index = mangaList.findIndex(manga => manga.id === id);
        if (index < -1) {
            return;
        }

        const newList = mangaList.filter(manga => manga.id !== id);
        const newManga = { ...mangaList[index], mirrors: { ...mangaList[index].mirrors } };
        delete newManga.mirrors[source];
        newManga.mirrors[urlSource] = {
            url,
            status: MangaStatus.Success,
            lastChapter: response.data.lastChapter.toString(),
        };
        newList.push(newManga);

        dispatch(setMangaArrayAction(newList));
        await mangaStorage.saveStorage({ manga: newList });
        message.success(ADD_MANGA_TEXT.success);
    };

export const updateManga = async (manga: Manga): Promise<Manga> => {
    const keys = getKeys(manga.mirrors);

    const mirrors = await Promise.allSettled(
        keys.map(source => getDataByUrl({ url: manga.mirrors[source]!.url, source }))
    );

    return {
        ...manga,
        mirrors: mirrors.reduce<Manga['mirrors']>((acc, mirror) => {
            if (mirror.status === 'fulfilled') {
                const { url, source, data } = mirror.value;

                if (data) {
                    acc[source] = {
                        url,
                        status: MangaStatus.Success,
                        lastChapter: data.lastChapter.toString(),
                    };
                } else {
                    acc[source] = {
                        url,
                        status: MangaStatus.Error,
                        lastChapter: manga.mirrors[source]!.lastChapter,
                    };
                }
            }
            return acc;
        }, {}),
    };
};

export const checkMangaUpdate = (): AsyncAction => async (dispatch, getState) => {
    const { manga } = getState().mangaPage;

    dispatch(setUpdatingAction(true));
    try {
        let hasProblem = false;
        let newChapterCount = 0;
        let index = 0;
        let result: Manga[] = [];

        while (index < manga.length) {
            const batch = manga.slice(index, index + BATCH_SIZE);
            const response = await Promise.all(batch.map(updateManga));
            const batchManga = response.reduce<Manga[]>((acc, updatedManga, key) => {
                if (hasNewChapters(batch[key].mirrors, updatedManga.mirrors)) newChapterCount++;
                acc.push({
                    ...batch[key],
                    image: updatedManga.image,
                    mirrors: updatedManga.mirrors,
                });
                return acc;
            }, []);
            result = [...result, ...batchManga];
            index += BATCH_SIZE;
        }

        dispatch(setMangaArrayAction(result));
        await mangaStorage.setMangaList(result);

        if (hasProblem) {
            message.warning(UPDATE_MANGA_TEXT.error);
        } else {
            message.success(UPDATE_MANGA_TEXT.success(newChapterCount));
        }
        await setExtensionIconMode(newChapterCount);
    } catch (e) {
        console.error(e);
        message.warning(UPDATE_MANGA_TEXT.error);
    } finally {
        dispatch(setUpdatingAction(false));
    }
};

export const addManga =
    (url: string): AsyncAction =>
    async (dispatch, getState) => {
        const { manga } = getState().mangaPage;
        const fixedUrl = prepareMangaUrl(url);
        const source = determinateSourceType(fixedUrl);

        if (!source) {
            message.warning(ADD_MANGA_TEXT.notSupported);
            return;
        }

        dispatch(setAddingAction(true));
        try {
            const response = await getDataByUrl({ url: fixedUrl, source });
            if (!response.data) {
                message.error(ADD_MANGA_TEXT.error);
                return;
            }

            const newList = [...manga];
            const id = md5(response.data.title.trim().toLocaleLowerCase());
            const lastChapter = response.data.lastChapter.toString();

            const mangaIndex = newList.findIndex(i => i.id === id);
            if (mangaIndex > -1) {
                const existingManga = newList[mangaIndex];
                if (existingManga.mirrors[source]) {
                    message.warning(ADD_MANGA_TEXT.alreadyExist);
                    return;
                }

                newList[mangaIndex] = {
                    ...existingManga,
                    mirrors: {
                        ...existingManga.mirrors,
                        [source]: {
                            url,
                            status: MangaStatus.Success,
                            lastChapter,
                        },
                    },
                };
            } else {
                newList.push({
                    id,
                    title: response.data.title,
                    image: response.data.image,
                    prevChapter: lastChapter,
                    mirrors: {
                        [source]: {
                            url,
                            status: MangaStatus.Success,
                            lastChapter,
                        },
                    },
                });
            }

            dispatch(setMangaArrayAction(newList));
            await mangaStorage.saveStorage({ manga: newList });
            message.success(ADD_MANGA_TEXT.success);
        } catch (e) {
            console.error(e);
            message.error(ADD_MANGA_TEXT.error);
        } finally {
            dispatch(setAddingAction(false));
        }
    };

export const removeManga =
    (id: string): AsyncAction =>
    async (dispatch, getState) => {
        const { manga } = getState().mangaPage;

        const newList = manga.filter(item => item.id !== id);
        dispatch(setMangaArrayAction(newList));
        await mangaStorage.saveStorage({ manga: newList });
    };

export const removeMirror =
    ({ mangaId, source }: { mangaId: string; source: SourceType }): AsyncAction =>
    async (dispatch, getState) => {
        const { manga } = getState().mangaPage;
        const { currentManga, otherManga } = manga.reduce<{ currentManga: Manga | undefined; otherManga: Manga[] }>(
            (acc, m) => {
                if (m.id === mangaId) {
                    acc.currentManga = { ...m, mirrors: { ...m.mirrors } };
                } else {
                    acc.otherManga.push(m);
                }
                return acc;
            },
            {
                currentManga: undefined,
                otherManga: [],
            }
        );

        if (!currentManga) return;

        if (Object.keys(currentManga.mirrors).length === 1) {
            dispatch(removeManga(mangaId));
            return;
        }

        delete currentManga.mirrors[source];
        const newList = [...otherManga, currentManga];
        dispatch(setMangaArrayAction(newList));
        await mangaStorage.saveStorage({ manga: newList });
    };

export const readManga =
    (id: string): AsyncAction =>
    async (dispatch, getState) => {
        const { manga } = getState().mangaPage;

        const index = manga.findIndex(i => i.id === id);
        if (index === -1) return;

        const { newList, newChaptersCount } = manga.reduce<{ newList: Manga[]; newChaptersCount: number }>(
            (acc, manga, key) => {
                if (key === index) {
                    acc.newList.push({ ...manga, prevChapter: getMaxChapter(manga.mirrors).toString() });
                } else {
                    acc.newList.push(manga);
                    if (manga.prevChapter !== getMaxChapter(manga.mirrors).toString()) {
                        acc.newChaptersCount++;
                    }
                }
                return acc;
            },
            { newList: [], newChaptersCount: 0 }
        );
        dispatch(setMangaArrayAction(newList));
        await setExtensionIconMode(newChaptersCount);

        await mangaStorage.saveStorage({ manga: newList });

        const { source, mirror } = getMaxChapterMirror(manga[index].mirrors);
        await showMangaNotification({ source, prevChapter: manga[index].prevChapter });
        await chrome.tabs.create({ url: mirror.url, active: true });
    };

export default slice.reducer;
