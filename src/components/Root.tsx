import React, { FC } from 'react';
import Container from './Container';
import { Typography, Tabs } from 'antd';
import AddForm from './AddForm';
import UpdateTab from './UpdateTab';
import MangaListTab from './MangaListTab';
import { Store } from '../types/Store';
import { useAppSelector } from '../hooks';
import { EMPTY_TEXT } from '../constants/text';
import Empty from './Empty';

const selector = (state: Store) => state.manga.length > 0;

const Root: FC = () => {
    const hasManga = useAppSelector(selector);

    return (
        <Container>
            <Typography.Title level={3}>Manga update checker</Typography.Title>
            <AddForm />
            {hasManga ? (
                <Tabs type="card">
                    <Tabs.TabPane tab="Новые главы" key={1}>
                        <UpdateTab />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Список манги" key={2}>
                        <MangaListTab />
                    </Tabs.TabPane>
                </Tabs>
            ) : (
                <Empty description={EMPTY_TEXT.list} margin="30px 0 0 0" />
            )}
        </Container>
    );
};

export default Root;
