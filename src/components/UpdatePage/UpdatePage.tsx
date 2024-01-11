import React, { FC } from 'react';
import MangaPlates from '../../baseComponents/MangaPlates';
import Page from '../../baseComponents/Page';
import { readManga, selectManga } from '../../state/slices/mangaPage';
import { Manga } from '../../types/Manga';
import { MangaStatus } from '../../enum';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { createSelector } from '@reduxjs/toolkit';
import UpdateButton from './UpdateButton';
import ProblemBlock from './ProblemBlock';
import MangaPlate from '../../baseComponents/MangaPlate/MangaPlate';
import ProblemItem from './ProblemItem';

const selector = createSelector([selectManga], (manga: Manga[]) => {
    const updated = manga
        .filter(item => item.prevChapter !== item.lastChapter)
        .sort((a, b) => {
            if (a.source > b.source) return -1;
            if (a.source < b.source) return 1;
            return 0;
        });
    const problems = manga.filter(item => item.status === MangaStatus.Error);

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
        dispatch(readManga(manga.url));
    };

    const handleProblemClick = (manga: Manga) => {
        window.open(manga.url);
    };

    return (
        <Page>
            {showUpdated && (
                <MangaPlates>
                    {updated.map(manga => (
                        <MangaPlate key={manga.url} manga={manga} onClick={handlePlateClick} />
                    ))}
                </MangaPlates>
            )}
            {showProblems && (
                <ProblemBlock>
                    {problems.map(manga => (
                        <ProblemItem manga={manga} onClick={handleProblemClick} />
                    ))}
                </ProblemBlock>
            )}
            <UpdateButton />
        </Page>
    );
};

export default UpdatePage;
