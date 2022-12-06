import React, { FC } from 'react';
import styled from '@emotion/styled';
import UpdateButton from './UpdateButton';
import { Store } from '../../types/Store';
import { useAppSelector } from '../../hooks';
import MangaList from '../MangaList/MangaList';
import { EMPTY_TEXT, WARNING_TEXT } from '../../constants/text';
import Empty from '../Empty';
import { shallowEqual } from 'react-redux';
import { MangaStatus } from '../../enum';
import { Alert, Typography } from 'antd';

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px 0;
`;

const selector = (state: Store) => ({
    updated: state.manga.filter(manga => manga.prevChapter !== manga.lastChapter),
    problem: state.manga.filter(manga => manga.status === MangaStatus.Error),
});

const UpdateTab: FC = () => {
    const { updated, problem } = useAppSelector(selector, shallowEqual);

    return (
        <Wrap>
            <UpdateButton />
            {updated.length > 0 ? (
                <MangaList mangaList={updated} />
            ) : (
                <Empty description={EMPTY_TEXT.newChapters} margin="30px 0 0 0" />
            )}
            {problem.length > 0 && (
                <>
                    <div>
                        <Typography.Title level={4}>Проблемы с обновлением</Typography.Title>
                        <MangaList mangaList={problem} />
                    </div>
                    <Alert message={WARNING_TEXT.update} type="warning" />
                </>
            )}
        </Wrap>
    );
};

export default UpdateTab;
