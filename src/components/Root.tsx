import React, { FC } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Container from '../baseComponents/Container';
import router from '../router';

const Root: FC = () => {
    return (
        <Container>
            <RouterProvider router={createMemoryRouter(router)} />
        </Container>
    );
};

export default Root;
