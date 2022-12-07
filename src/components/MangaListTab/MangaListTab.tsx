import React, { FC } from 'react';
import { Store } from '../../types/Store';
import MangaList from '../MangaList/MangaList';
import { useAppSelector } from '../../hooks';
import ExportButton from './ExportButton';
import ImportButton from './ImportButton';
import styled from '@emotion/styled';
import { createSelector } from '@reduxjs/toolkit';
import { Manga } from '../../types/Manga';

const getManga = (state: Store) => state.manga;
const selector = createSelector([getManga], (manga: Manga[]) => {
    return [...manga].sort((a, b) => {
        if (a.source > b.source) return -1;
        if (a.source < b.source) return 1;
        return 0;
    });
});

const ButtonsWrap = styled.div`
    display: flex;
    gap: 0 10px;
`;

const MangaListTab: FC = () => {
    const mangaList = useAppSelector(selector);

    return (
        <>
            <ButtonsWrap>
                <ExportButton />
                <ImportButton />
            </ButtonsWrap>
            <MangaList mangaList={mangaList} />
        </>
    );
};

export default MangaListTab;
