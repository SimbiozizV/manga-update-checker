import { Action, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { searchDesuRequest } from '../../api/desu';
import { searchMangaLibRequest } from '../../api/mangaLib';
import { searchMangaOvh } from '../../api/mangaOvh';
import { searchReadMangaRequest } from '../../api/readManga';
import { searchRemangaRequest } from '../../api/remanga';
import { SEARCH_MANGA_TEXT } from '../../constants/text';
import { SearchResultManga } from '../../types/search/SearchResultManga';
import { Store } from '../../types/Store';

const initialState: Store['searchPage'] = {
    manga: [],
    isWaiting: false,
};

const searchSlice = createSlice({
    name: 'searchPage',
    initialState,
    reducers: {
        setManga(store, { payload }: PayloadAction<SearchResultManga[]>) {
            store.manga = payload;
        },
        setWaiting(store, { payload }: PayloadAction<boolean>) {
            store.isWaiting = payload;
        },
    },
});

export const { setManga, setWaiting } = searchSlice.actions;

export const selectSearchPage = (state: Store) => state.searchPage;

export const searchMangaByName =
    (name: string): ThunkAction<void, Store, undefined, Action> =>
    async dispatch => {
        if (!name) {
            dispatch(setManga([]));
            return;
        }

        dispatch(setWaiting(true));
        try {
            const response = await Promise.allSettled([
                searchReadMangaRequest(name),
                searchMangaLibRequest(name),
                searchDesuRequest(name),
                searchRemangaRequest(name),
                searchMangaOvh(name),
            ]);

            let searchResult: SearchResultManga[] = response
                .flatMap(result => (result.status === 'fulfilled' ? result.value : []))
                .filter(item => item.name && item.thumbnail && item.href)
                .sort((a, b) => a.name.localeCompare(b.name));

            if (searchResult.length) dispatch(setManga(searchResult));
        } catch (e) {
            console.error(e);
            message.error(SEARCH_MANGA_TEXT.error);
        } finally {
            dispatch(setWaiting(false));
        }
    };

export default searchSlice.reducer;
