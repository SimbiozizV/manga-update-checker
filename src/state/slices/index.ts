import { Store } from '../../types/Store';
import { Action, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import readMangaParser from '../../parsers/readMangaParser';
import { Manga } from '../../types/Manga';
import { message } from 'antd';
import getDataByUrl from '../../api/getDataByUrl';
import { determinateSourceType, getParserBySourceType, prepareMangaUrl } from '../../helpers';
import MangaStorage from '../../class/MangaStorage';
import { STORAGE_KEY } from '../../constants';
import { ADD_MANGA_TEXT, UPDATE_MANGA_TEXT } from '../../constants/text';
import { MangaStatus } from '../../enum';

const mangaStorage = new MangaStorage(STORAGE_KEY);

const initialState: Store = {
    manga: [],
    isAdding: false,
    isUpdating: false,
};

const slice = createSlice({
    name: 'mangaupdater',
    initialState,
    reducers: {
        setUpdatingAction(store, { payload }: PayloadAction<boolean>) {
            store.isUpdating = payload;
        },
        setAddingAction(store, { payload }: PayloadAction<boolean>) {
            store.isAdding = payload;
        },
        setMangaArrayAction(store, { payload }: PayloadAction<Manga[]>) {
            store.manga = payload;
        },
    },
});

export const { setUpdatingAction, setAddingAction, setMangaArrayAction } = slice.actions;

const updateManga = (manga: Manga): Promise<Manga> => {
    return getDataByUrl(manga.url, readMangaParser).then(data => {
        return data ? { ...manga, prevChapter: manga.lastChapter, lastChapter: data.lastChapter } : manga;
    });
};

export const checkMangaUpdate = (): ThunkAction<void, Store, undefined, Action> => (dispatch, getState) => {
    const { manga } = getState();

    dispatch(setUpdatingAction(true));
    Promise.allSettled(manga.map(updateManga))
        .then(updatedManga => {
            let hasProplem = false;
            let newChapterCount = 0;

            const result = updatedManga.reduce<Manga[]>((acc, mangaItem, key) => {
                if (mangaItem.status === 'fulfilled') {
                    if (manga[key].lastChapter !== mangaItem.value.lastChapter) newChapterCount++;
                    acc.push({ ...manga[key], lastChapter: mangaItem.value.lastChapter, status: MangaStatus.Success });
                } else {
                    hasProplem = true;
                    acc.push({ ...manga[key], status: MangaStatus.Error });
                }
                return acc;
            }, []);

            dispatch(setMangaArrayAction(result));
            mangaStorage.setMangaList(result);

            if (hasProplem) {
                message.warning(UPDATE_MANGA_TEXT.error);
            } else {
                message.success(UPDATE_MANGA_TEXT.success(newChapterCount));
            }
        })
        .finally(() => {
            dispatch(setUpdatingAction(false));
        });
};

export const loadMangaFromChromeStore = (): ThunkAction<void, Store, undefined, Action> => dispatch => {
    mangaStorage.getStorage().then(({ manga }) => {
        dispatch(setMangaArrayAction(manga));
    });
};

export const addManga =
    (url: string): ThunkAction<void, Store, undefined, Action> =>
    (dispatch, getState) => {
        const { manga } = getState();
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
        const { manga } = getState();

        const newList = manga.filter(item => item.url !== url);
        dispatch(setMangaArrayAction(newList));
        mangaStorage.saveStorage({ manga: newList });
    };

export const onRedirectByLink =
    (url: string): ThunkAction<void, Store, undefined, Action> =>
    (dispatch, getState) => {
        const { manga } = getState();

        const index = manga.findIndex(i => i.url === url);
        if (index > -1) {
            const newList = manga.map((mangaItem, key) =>
                key === index ? { ...mangaItem, prevChapter: mangaItem.lastChapter } : mangaItem
            );
            newList[index].prevChapter = newList[index].lastChapter;
            dispatch(setMangaArrayAction(newList));
            mangaStorage.saveStorage({ manga: newList }).then(() => {
                chrome.tabs.create({ url, active: true });
            });
        }
    };

export default slice.reducer;
