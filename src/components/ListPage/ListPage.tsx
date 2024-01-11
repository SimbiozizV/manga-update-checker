import React, { FC } from 'react';
import Page from '../../baseComponents/Page';
import { readManga, selectFilter, selectManga, removeManga } from '../../state/slices/mangaPage';
import { Manga } from '../../types/Manga';
import { createSelector } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../../hooks';
import MangaPlates from '../../baseComponents/MangaPlates';
import Filter from './Filter';
import { EMPTY_TEXT } from '../../constants/text';
import Empty from '../Empty';
import MangaListPlate from '../../baseComponents/MangaPlate/MangaListPlate';
import FileOperations from './FileOperations';

const selector = createSelector([selectManga, selectFilter], (manga: Manga[], filter) => {
    return {
        mangaList: [...manga]
            .filter(item => item.title.toLowerCase().includes(filter))
            .sort((a, b) => {
                if (a.source > b.source) return -1;
                if (a.source < b.source) return 1;
                return 0;
            }),
        hasFilter: filter.length > 0,
    };
});

const ListPage: FC = () => {
    const dispatch = useAppDispatch();
    const { mangaList, hasFilter } = useAppSelector(selector);

    const handlePlateClick = (manga: Manga) => {
        dispatch(readManga(manga.url));
    };

    const handleDeleteClick = (manga: Manga) => {
        dispatch(removeManga(manga.url));
    };

    return (
        <Page>
            <Filter />
            <FileOperations />
            {mangaList.length > 0 ? (
                <MangaPlates>
                    {mangaList.map(manga => (
                        <MangaListPlate
                            key={manga.url}
                            manga={manga}
                            onClick={handlePlateClick}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </MangaPlates>
            ) : (
                <Empty description={hasFilter ? EMPTY_TEXT.filter : EMPTY_TEXT.list} margin="30px 0 0 0" />
            )}
        </Page>
    );
};

export default ListPage;
