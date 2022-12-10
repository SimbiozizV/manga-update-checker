import React, { FC } from 'react';
import UpdateButton from './UpdateButton';
import { useAppSelector } from '../../hooks';
import MangaList from '../MangaList/MangaList';
import { EMPTY_TEXT, WARNING_TEXT } from '../../constants/text';
import Empty from '../Empty';
import { shallowEqual } from 'react-redux';
import { MangaStatus } from '../../enum';
import { Alert, Typography } from 'antd';
import { createSelector } from '@reduxjs/toolkit';
import { selectManga } from '../../state/slices';
import { Manga } from '../../types/Manga';
import TabWrap from '../TabWrap';

const selector = createSelector([selectManga], (manga: Manga[]) => {
    const updated = manga.filter(item => item.prevChapter !== item.lastChapter);
    const problems = manga.filter(item => item.status === MangaStatus.Error);

    return {
        updated,
        problems,
        showUpdated: updated.length > 0,
        showProblems: problems.length > 0,
    };
});

const UpdateTab: FC = () => {
    const { updated, problems, showUpdated, showProblems } = useAppSelector(selector, shallowEqual);

    return (
        <TabWrap>
            {(showUpdated || showProblems) && <UpdateButton />}
            {showUpdated ? (
                <MangaList mangaList={updated} />
            ) : (
                <Empty description={EMPTY_TEXT.newChapters} margin="30px 0 0 0" />
            )}
            {showProblems && (
                <>
                    <div>
                        <Typography.Title level={4}>Проблемы с обновлением</Typography.Title>
                        <MangaList mangaList={problems} />
                    </div>
                    <Alert message={WARNING_TEXT.update} type="warning" />
                </>
            )}
        </TabWrap>
    );
};

export default UpdateTab;
