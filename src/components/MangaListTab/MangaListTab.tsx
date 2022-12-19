import React, { FC } from 'react';
import MangaList from '../MangaList/MangaList';
import { useAppSelector } from '../../hooks';
import { selectFilter, selectManga } from '../../state/slices/mangaTab';
import { createSelector } from '@reduxjs/toolkit';
import { Manga } from '../../types/Manga';
import { EMPTY_TEXT } from '../../constants/text';
import Empty from '../Empty';
import FileOperations from './FileOperations';
import Filter from './Filter';
import TabWrap from '../../baseComponents/TabWrap';

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

const MangaListTab: FC = () => {
    const { mangaList, hasFilter } = useAppSelector(selector);

    return (
        <TabWrap>
            <FileOperations />
            <Filter />
            {mangaList.length > 0 ? (
                <MangaList mangaList={mangaList} />
            ) : (
                <Empty description={hasFilter ? EMPTY_TEXT.filter : EMPTY_TEXT.list} margin="30px 0 0 0" />
            )}
        </TabWrap>
    );
};

export default MangaListTab;
