import React, { FC } from 'react';
import UpdateButton from './UpdateButton';
import { useAppSelector } from '../../hooks';
import MangaList from '../MangaList/MangaList';
import { EMPTY_TEXT, WARNING_TEXT } from '../../constants/text';
import Empty from '../Empty';
import { MangaStatus } from '../../enum';
import { Alert, Typography } from 'antd';
import { createSelector } from '@reduxjs/toolkit';
import { selectManga } from '../../state/slices/mangaTab';
import { Manga } from '../../types/Manga';
import TabWrap from '../../baseComponents/TabWrap';

const selector = createSelector([selectManga], (manga: Manga[]) => {
    const updated = manga.filter(item => item.prevChapter !== item.lastChapter);
    const problems = manga.filter(item => item.status === MangaStatus.Error);

    return {
        updated,
        problems,
        showUpdated: manga.length > 0,
        showProblems: problems.length > 0,
    };
});

const UpdateTab: FC = () => {
    const { updated, problems, showUpdated, showProblems } = useAppSelector(selector);

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
