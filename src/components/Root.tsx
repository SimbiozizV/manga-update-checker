import React, { FC } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import router from '../router';
import Container from '../baseComponents/Container';

const Root: FC = () => {
    return (
        <Container>
            <RouterProvider router={createMemoryRouter(router)} />
        </Container>
    );
};

export default Root;
