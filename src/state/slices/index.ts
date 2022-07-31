import { Store } from '../../types/Store';
import { Action, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import readMangaParser from '../../parsers/readMangaParser';
import { Manga } from '../../types/Manga';
import { message } from 'antd';
import addMangaToChromeStorage from '../../helpers/addMangaToChromeStorage';
import getChromeStorage from '../../helpers/getChromeStorage';
import removeMangaFromChromeStorage from '../../helpers/removeMangaFromChromeStorage';
import getDataByUrl from '../../api/getDataByUrl';
import replaceChromeStorageManga from '../../helpers/replaceChromeStorageManga';

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
        addMangaAction(store, { payload }: PayloadAction<Manga>) {
            store.manga.push(payload);
        },
        removeMangaAction(store, { payload }: PayloadAction<string>) {
            debugger;
            const index = store.manga.findIndex(manga => manga.url === payload);
            if (index > -1) {
                store.manga.splice(index, 1);
            }
        },
        setMangaArrayAction(store, { payload }: PayloadAction<Manga[]>) {
            store.manga = payload;
        },
    },
});

export const { setUpdatingAction, setAddingAction, addMangaAction, setMangaArrayAction, removeMangaAction } =
    slice.actions;

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
            dispatch(setMangaArrayAction(updatedManga));
            replaceChromeStorageManga(updatedManga);
            message.success('манга обновлена');
        })
        .finally(() => {
            dispatch(setUpdatingAction(false));
        });
};

export const loadMangaFromChromeStore = (): ThunkAction<void, Store, undefined, Action> => dispatch => {
    getChromeStorage().then(data => {
        dispatch(setMangaArrayAction(data.manga));
    });
};

export const addManga =
    (url: string): ThunkAction<void, Store, undefined, Action> =>
    (dispatch, getState) => {
        const { manga } = getState();
        const index = manga.findIndex(i => i.url === url);

        if (index > -1) {
            message.warning('манга уже есть в списке');
        } else {
            dispatch(setAddingAction(true));
            getDataByUrl(url, readMangaParser)
                .then(data => {
                    if (data) {
                        const maga = {
                            url,
                            title: data.title,
                            prevChapter: data.lastChapter,
                            lastChapter: data.lastChapter,
                        };
                        dispatch(addMangaAction(maga));
                        addMangaToChromeStorage(maga);
                        message.success('манга успешно добавлена');
                    } else {
                        message.error('ошибка получения данных');
                    }
                })
                .finally(() => {
                    dispatch(setAddingAction(false));
                });
        }
    };

export const removeManga =
    (url: string): ThunkAction<void, Store, undefined, Action> =>
    dispatch => {
        dispatch(removeMangaAction(url));
        removeMangaFromChromeStorage(url);
    };

export default slice.reducer;
