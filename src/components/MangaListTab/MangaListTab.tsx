import React, { FC } from 'react';
import { Store } from '../../types/Store';
import MangaList from '../MangaList/MangaList';
import { useAppSelector } from '../../hooks';
import ExportButton from './ExportButton';
import ImportButton from './ImportButton';
import styled from '@emotion/styled';

const selector = (state: Store) => state.manga;

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
