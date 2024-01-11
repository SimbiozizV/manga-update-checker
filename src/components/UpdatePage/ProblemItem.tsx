import React, { FC } from 'react';
import { Manga } from '../../types/Manga';
import styled from '@emotion/styled';
import { getIconBySource } from '../../helpers';

const Wrap = styled.div`
    display: flex;
    gap: 0 5px;
    font-weight: 500;
    cursor: pointer;

    &:hover {
        color: #1677ff;
    }
`;

type Props = {
    manga: Manga;
    onClick: (manga: Manga) => void;
};

const ProblemItem: FC<Props> = ({ manga, onClick }) => {
    const handleClick = () => {
        onClick(manga);
    };

    return (
        <Wrap onClick={handleClick}>
            <img src={getIconBySource(manga.source)} alt="icon" />
            <div>{manga.title}</div>
        </Wrap>
    );
};

export default ProblemItem;
