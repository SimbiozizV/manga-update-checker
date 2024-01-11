import React, { FC } from 'react';
import { Manga } from '../../types/Manga';
import styled from '@emotion/styled';
import ImageBlock from './ImageBlock';
import PlateTitle from './PlateTitle';

const Plate = styled.div`
    display: grid;
    grid-template-rows: 135px 1fr;
    gap: 10px 0;
    width: 145px;
    padding: 5px 5px 10px 5px;
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
