import React, { FC } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import MangaPlate from '../../baseComponents/MangaPlate/MangaPlate';
import MangaPlates from '../../baseComponents/MangaPlates';
import Page from '../../baseComponents/Page';
import { MangaStatus } from '../../enum';
import { getMaxChapter } from '../../helpers/getMaxChapter';
import { getMaxChapterMirror } from '../../helpers/getMaxChapterMirror';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { readManga, selectManga } from '../../state/slices/mangaPage';
import { Manga } from '../../types/Manga';
import ProblemBlock from './ProblemBlock';
import ProblemItem from './ProblemItem';

const selector = createSelector([selectManga], (manga: Manga[]) => {
    const updated = manga.filter(item => item.prevChapter !== getMaxChapter(item.mirrors));
    const problems = manga.filter(item => Object.values(item.mirrors).some(i => i.status === MangaStatus.Error));

    return {
        updated,
        problems,
        showUpdated: manga.length > 0,
        showProblems: problems.length > 0,
    };
});

const UpdatePage: FC = () => {
    const dispatch = useAppDispatch();
    const { updated, problems, showUpdated, showProblems } = useAppSelector(selector);

    const handlePlateClick = (manga: Manga) => {
        dispatch(readManga(manga.id));
    };

    const handleProblemClick = (manga: Manga) => {
        window.open(getMaxChapterMirror(manga.mirrors).mirror.url);
    };

    return (
        <Page>
            {showUpdated && (
                <MangaPlates>
                    {updated.map(manga => (
                        <MangaPlate key={manga.id} manga={manga} onClick={handlePlateClick} />
                    ))}
                </MangaPlates>
            )}
            {showProblems && (
                <ProblemBlock>
                    {problems.map(manga => (
                        <ProblemItem key={manga.id} manga={manga} onClick={handleProblemClick} />
                    ))}
                </ProblemBlock>
            )}
        </Page>
    );
};

export default UpdatePage;
