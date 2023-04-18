import { Store } from '../../types/Store';
import { Action, createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { SearchResultManga } from '../../types/search/SearchResultManga';
import { searchReadMangaRequest } from '../../api/readManga';
import { searchMangaLibRequest } from '../../api/mangaLib';
import { searchDesuRequest } from '../../api/desu';
import { searchRemangaRequest } from '../../api/remanga';
import { searchMangaOvh } from '../../api/mangaOvh';

const initialState: Store['searchTab'] = {
    manga: [],
    isWaiting: false,
};

const searchSlice = createSlice({
    name: 'searchTab',
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

export const selectSearchTab = (state: Store) => state.searchTab;

export const searchMangaByName =
    (name: string): ThunkAction<void, Store, undefined, Action> =>
    dispatch => {
        if (name) {
            dispatch(setWaiting(true));
            Promise.allSettled([
                searchReadMangaRequest(name),
                searchMangaLibRequest(name),
                searchDesuRequest(name),
                searchRemangaRequest(name),
                searchMangaOvh(name),
            ])
                .then(results => {
                    let searchResult: SearchResultManga[] = [];
                    results.forEach(result => {
                        if (result.status === 'fulfilled') {
                            const responseResult = result.value.filter(
                                item => item.name && item.thumbnail && item.href
                            );
                            if (responseResult.length) {
                                searchResult = [...searchResult, ...responseResult];
                            }
                        }
                    });

                    if (searchResult.length) dispatch(setManga(searchResult));
                })
                .finally(() => {
                    dispatch(setWaiting(false));
                });
        } else {
            dispatch(setManga([]));
        }
    };

export default searchSlice.reducer;
