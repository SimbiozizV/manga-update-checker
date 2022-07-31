import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import reducer from './slices';

export const store = configureStore({
    reducer,
    middleware: getDefaultMiddleware => {
        const defaultMiddleware = getDefaultMiddleware();
        return __DEV__ ? defaultMiddleware.concat(logger) : defaultMiddleware;
    },
    devTools: __DEV__,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
