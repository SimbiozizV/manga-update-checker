import React, { FC } from 'react';
import Container from '../baseComponents/Container';
import { Typography, Tabs } from 'antd';
import AddForm from './AddForm';
import UpdateTab from './UpdateTab';
import MangaListTab from './MangaListTab';
import SearchTab from './SearchTab';

const items = [
    { label: 'Новые главы', key: 'item-1', children: <UpdateTab /> },
    { label: 'Список манги', key: 'item-2', children: <MangaListTab /> },
    { label: 'Поиск манги', key: 'item-3', children: <SearchTab /> },
];

const Root: FC = () => {
    return (
        <Container>
            <Typography.Title level={3}>Manga update checker</Typography.Title>
            <AddForm />
            <Tabs type="card" items={items} />
        </Container>
    );
};

export default Root;
