import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './components/Root';
import 'antd/dist/antd.min.css';
import { Provider } from 'react-redux';
import { store } from './state';

(() => {
    const container = document.getElementById('app');
    if (container) {
        const root = createRoot(container);
        root.render(
            <Provider store={store}>
                <Root />
            </Provider>
        );
    }
})();
