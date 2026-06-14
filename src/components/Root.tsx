import React, { FC, Suspense } from 'react';
import { Spin } from 'antd';
import { createMemoryRouter, RouterProvider } from 'react-router';
import Container from '../baseComponents/Container';
import router from '../router';
import { Header } from '../baseComponents/Header';

const memoryRouter = createMemoryRouter(router);

const Root: FC = () => {
    return (
        <Container>
            <Header />
            <Suspense fallback={<Spin description="Загрузка" size="large" />}>
                <RouterProvider router={memoryRouter} />
            </Suspense>
        </Container>
    );
};

export default Root;
