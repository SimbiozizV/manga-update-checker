import React, { FC } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import Container from '../baseComponents/Container';
import router from '../router';
import '@ant-design/v5-patch-for-react-19';

const Root: FC = () => {
    return (
        <Container>
            <RouterProvider router={createMemoryRouter(router)} />
        </Container>
    );
};

export default Root;
