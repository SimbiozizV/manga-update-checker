import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Manga } from '../../types/Manga';
import ImageBlock from './ImageBlock';
import PlateTitle from './PlateTitle';

const Plate = styled.div`
    display: grid;
    grid-template-rows: 145px 1fr;
    gap: 10px 0;
    width: 145px;
    cursor: pointer;

    &:hover {
        color: #1677ff;
    }
`;

type Props = {
    manga: Manga;
    onClick: (manga: Manga) => void;
};

const MangaPlate: FC<Props> = ({ manga, onClick }) => {
    const handlePlateClick = () => {
        onClick(manga);
    };

    return (
        <Plate onClick={handlePlateClick}>
            <ImageBlock manga={manga} />
            <PlateTitle>{manga.title}</PlateTitle>
        </Plate>
    );
};

export default MangaPlate;
