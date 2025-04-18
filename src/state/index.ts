import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { Manga } from '../types/Manga';
import { Store as StoreType } from '../types/Store';
import reducer from './slices';

export const initStore = (manga: Manga[]) => {
    const preloadedState: StoreType = {
        mangaPage: {
            manga,
            filter: '',
            isAdding: false,
            isUpdating: false,
            isImported: false,
        },
        searchPage: {
            manga: [],
            isWaiting: false,
        },
    };

    return configureStore({
        preloadedState,
        reducer,
        middleware: getDefaultMiddleware => {
            const defaultMiddleware = getDefaultMiddleware();
            return __DEV__ ? defaultMiddleware.concat(logger) : defaultMiddleware;
        },
        devTools: __DEV__,
    });
};

export type Store = ReturnType<typeof initStore>;
