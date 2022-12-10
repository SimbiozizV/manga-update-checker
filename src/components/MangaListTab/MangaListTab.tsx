import React, { FC } from 'react';
import MangaList from '../MangaList/MangaList';
import { useAppSelector } from '../../hooks';
import { selectManga } from '../../state/slices';
import ExportButton from './ExportButton';
import ImportButton from './ImportButton';
import styled from '@emotion/styled';
import { createSelector } from '@reduxjs/toolkit';
import { Manga } from '../../types/Manga';
import { EMPTY_TEXT } from '../../constants/text';
import Empty from '../Empty';

const selector = createSelector([selectManga], (manga: Manga[]) => {
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
            {mangaList.length > 0 ? (
                <MangaList mangaList={mangaList} />
            ) : (
                <Empty description={EMPTY_TEXT.list} margin="30px 0 0 0" />
            )}
        </>
    );
};

export default MangaListTab;
