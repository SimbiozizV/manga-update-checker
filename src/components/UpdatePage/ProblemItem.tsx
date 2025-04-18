import React, { FC } from 'react';
import styled from '@emotion/styled';
import { getIconBySource } from '../../helpers';
import { getKeys } from '../../helpers/getKeys';
import { Manga } from '../../types/Manga';

const Wrap = styled.div`
    display: flex;
    gap: 0 5px;
    align-items: flex-start;
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
            {getKeys(manga.mirrors).map(source => (
                <img key={manga.mirrors[source]!.url} src={getIconBySource(source)} alt="icon" />
            ))}
            <div>{manga.title}</div>
        </Wrap>
    );
};

export default ProblemItem;
