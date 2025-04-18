import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import MangaStorage from './class/MangaStorage';
import GlobalStyles from './components/GlobalStyles';
import Root from './components/Root';
import { STORAGE_KEY } from './constants';
import { initStore } from './state';

(async () => {
    const container = document.getElementById('app');
    if (container) {
        const root = createRoot(container);

        const mangaStorage = new MangaStorage(STORAGE_KEY);
        const { manga } = await mangaStorage.getStorage();
        const store = initStore(manga);

        root.render(
            <Provider store={store}>
                <GlobalStyles />
                <Root />
            </Provider>
        );
    }
})();
