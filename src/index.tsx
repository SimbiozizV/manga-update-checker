import '@ant-design/v5-patch-for-react-19';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import MangaStorage from './class/MangaStorage';
import GlobalStyles from './components/GlobalStyles';
import Root from './components/Root';
import { STORAGE_KEY } from './constants';
import { initStore } from './state';
import { subscribeToStorageChanges } from './storage/storageSync';

const renderFallback = (container: HTMLElement, message: string) => {
    const root = createRoot(container);
    root.render(<div style={{ padding: 16, width: 500 }}>{message}</div>);
};

(async () => {
    const container = document.getElementById('app');
    if (!container) return;

    try {
        const mangaStorage = new MangaStorage(STORAGE_KEY);
        const { manga } = await mangaStorage.getStorage();
        const store = initStore(manga);

        subscribeToStorageChanges(store.dispatch);

        const root = createRoot(container);
        root.render(
            <Provider store={store}>
                <GlobalStyles />
                <Root />
            </Provider>
        );
    } catch (error) {
        console.error('Failed to initialize popup:', error);
        renderFallback(
            container,
            'Не удалось загрузить расширение. Перезагрузите его на странице chrome://extensions/.'
        );
    }
})();
