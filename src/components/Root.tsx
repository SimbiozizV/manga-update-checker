import React, { FC, useEffect } from 'react';
import Container from './Container';
import { Typography } from 'antd';
import AddForm from './AddForm';
import MangaList from './MangaList';
import { useAppDispatch } from '../hooks';
import { loadMangaFromChromeStore } from '../state/slices';
import Controls from './Controls';

const Root: FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadMangaFromChromeStore());
    }, [dispatch]);

    return (
        <Container>
            <Typography.Title level={3}>Manga update checker</Typography.Title>
            <AddForm />
            <Controls />
            <MangaList />
        </Container>
    );
};

export default Root;
