import React from 'react';
import { RouteObject } from 'react-router';
import ListPage from './components/ListPage';
import SearchPage from './components/SearchPage';
import UpdatePage from './components/UpdatePage';
import { Route } from './enum';

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
