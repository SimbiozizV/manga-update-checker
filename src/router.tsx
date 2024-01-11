import React from 'react';
import { RouteObject } from 'react-router-dom';
import UpdatePage from './components/UpdatePage';
import { Route } from './enum';
import ListPage from './components/ListPage';
import SearchPage from './components/SearchPage';

const router: RouteObject[] = [
    {
        path: Route.Root,
        element: <UpdatePage />,
    },
    {
        path: Route.MangaList,
        element: <ListPage />,
    },
    {
        path: Route.Search,
        element: <SearchPage />,
    },
];

export default router;
