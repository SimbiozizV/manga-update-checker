import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './components/Root';
import { Provider } from 'react-redux';
import { initStore } from './state';
import MangaStorage from './class/MangaStorage';
import { STORAGE_KEY } from './constants';
import GlobalStyles from './components/GlobalStyles';

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
