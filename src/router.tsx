import React, { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router';
import { Route } from './enum';
import Menu from './components/Menu';

const ListPage = lazy(() => import('./components/ListPage'));
const SearchPage = lazy(() => import('./components/SearchPage'));
const UpdatePage = lazy(() => import('./components/UpdatePage'));

const router: RouteObject[] = [
    {
        path: Route.Root,
        element: (
            <>
                <Menu />
                <Outlet />
            </>
        ),
        children: [
            {
                index: true,
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
        ],
    },
];

export default router;
