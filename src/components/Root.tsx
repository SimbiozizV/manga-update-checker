import React, { FC, useEffect } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import Container from '../baseComponents/Container';
import router from '../router';

const memoryRouter = createMemoryRouter(router);

const Root: FC = () => {
    useEffect(() => {
        const listener = (
            data: { type?: string },
            _sender: chrome.runtime.MessageSender,
            sendResponse: (response: unknown) => void
        ) => {
            if (data.type === 'ping') {
                sendResponse('pong');
            }
        };

        chrome.runtime.onMessage.addListener(listener);
        return () => chrome.runtime.onMessage.removeListener(listener);
    }, []);

    return (
        <Container>
            <RouterProvider router={memoryRouter} />
        </Container>
    );
};

export default Root;
