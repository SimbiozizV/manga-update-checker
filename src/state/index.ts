import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import reducer from './slices';
import { Manga } from '../types/Manga';
import { Store as StoreType } from '../types/Store';

export const initStore = (manga: Manga[]) => {
    const preloadedState: StoreType = {
        manga,
        isAdding: false,
        isUpdating: false,
        isImported: false,
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
