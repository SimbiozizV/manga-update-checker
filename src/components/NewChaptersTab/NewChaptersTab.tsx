import React, { FC } from 'react';
import styled from '@emotion/styled';
import UpdateButton from './UpdateButton';
import { Store } from '../../types/Store';
import { useAppSelector } from '../../hooks';
import MangaList from '../MangaList/MangaList';
import { EMPTY_TEXT } from '../../constants/text';
import Empty from '../Empty';

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px 0;
`;

const selector = (state: Store) => state.manga.filter(manga => manga.prevChapter !== manga.lastChapter);

const NewChaptersTab: FC = () => {
    const updatedList = useAppSelector(selector);

    return (
        <Wrap>
            <UpdateButton />
            {updatedList.length > 0 ? (
                <MangaList mangaList={updatedList} />
            ) : (
                <Empty description={EMPTY_TEXT.newChapters} margin="30px 0 0 0" />
            )}
        </Wrap>
    );
};

export default NewChaptersTab;
