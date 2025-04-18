import React, { FC, useMemo } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { ListPlate } from '../../baseComponents/MangaPlate/ListPlate';
import Page from '../../baseComponents/Page';
import { EMPTY_TEXT } from '../../constants/text';
import { useAppSelector } from '../../hooks';
import { selectFilter, selectManga } from '../../state/slices/mangaPage';
import { Manga } from '../../types/Manga';
import Empty from '../Empty';
import FileOperations from './FileOperations';
import Filter from './Filter';
import { ItemsList } from './ItemsList';

const selector = createSelector([selectManga, selectFilter], (manga: Manga[], filter) => {
    return {
        mangaList: manga
            .filter(item => item.title.toLowerCase().includes(filter.toLowerCase()))
            .sort((a, b) => a.title.localeCompare(b.title)),
        hasFilter: Boolean(filter.length),
    };
});

const ListPage: FC = () => {
    const { mangaList, hasFilter } = useAppSelector(selector);

    const items = useMemo(() => {
        return mangaList.map(item => {
            return <ListPlate key={item.id} manga={item} />;
        });
    }, [mangaList]);

    return (
        <Page>
            <Filter />
            <FileOperations />
            {mangaList.length > 0 ? (
                <ItemsList>{items}</ItemsList>
            ) : (
                <Empty description={hasFilter ? EMPTY_TEXT.filter : EMPTY_TEXT.list} margin="30px 0 0 0" />
            )}
        </Page>
    );
};

export default ListPage;
