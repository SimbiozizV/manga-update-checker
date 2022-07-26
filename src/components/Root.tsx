import React, { FC } from 'react';
import Container from './Container';
import { Typography, Tabs } from 'antd';
import AddForm from './AddForm';
import UpdateTab from './UpdateTab';
import MangaListTab from './MangaListTab';
import { Store } from '../types/Store';
import { useAppSelector } from '../hooks';

const selector = (state: Store) => state.manga.length > 0;

const items = [
    { label: 'Новые главы', key: 'item-1', children: <UpdateTab /> },
    { label: 'Список манги', key: 'item-2', children: <MangaListTab /> },
];

const Root: FC = () => {
    const hasManga = useAppSelector(selector);

    return (
        <Container>
            <Typography.Title level={3}>Manga update checker</Typography.Title>
            <AddForm />
            <Tabs type="card" items={items} />
        </Container>
    );
};

export default Root;
