import { Store } from '../../types/Store';
import { Action, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import readMangaParser from '../../parsers/readMangaParser';
import { Manga } from '../../types/Manga';
import { message } from 'antd';
import getDataByUrl from '../../api/getDataByUrl';
import determinateSourceType from '../../helpers/determinateSourceType';
import getParserBySourceType from '../../helpers/getParserBySourceType';
import prepareMangaUrl from '../../helpers/prepareMangaUrl';
import MangaStorage from '../../class/MangaStorage';
import { STORAGE_KEY } from '../../constants';
import isEqual from '../../helpers/isEqual';

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
    Promise.all(manga.map(updateManga))
        .then(updatedManga => {
            if (!isEqual(manga, updatedManga)) {
                dispatch(setMangaArrayAction(updatedManga));
                mangaStorage.setMangaList(updatedManga);
            }
            message.success('манга обновлена');
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
            message.warning('источник манги не поддерживается');
            return;
        }

        if (manga.findIndex(i => i.url === fixedUrl) > -1) {
            message.warning('манга уже есть в списке');
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
                        source,
                    });

                    dispatch(setMangaArrayAction(newList));
                    mangaStorage.saveStorage({ manga: newList });
                    message.success('манга успешно добавлена');
                } else {
                    message.error('ошибка получения данных');
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

        const index = manga.findIndex(i => i.url === url);
        if (index > -1) {
            const newList = [...manga];
            newList.splice(index, 1);
            dispatch(setMangaArrayAction(newList));
            mangaStorage.saveStorage({ manga: newList });
        }
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
