import React, { FC } from 'react';
import { Manga } from '../../types/Manga';
import styled from '@emotion/styled';
import MangaRemoveButton from './MangaRemoveButton';
import ImageBlock from './ImageBlock';
import PlateTitle from './PlateTitle';

const Plate = styled.div`
    display: grid;
    grid-template-rows: 135px 1fr 1fr;
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
    onDelete: (manga: Manga) => void;
};

const MangaListPlate: FC<Props> = ({ manga, onClick, onDelete }) => {
    console.log(manga);
    const handlePlateClick = () => {
        onClick(manga);
    };

    const handleDelete = () => {
        onDelete(manga);
    };

    return (
        <Plate>
            <ImageBlock manga={manga} onClick={handlePlateClick} />
            <PlateTitle onClick={handlePlateClick}>{manga.title}</PlateTitle>
            <MangaRemoveButton onRemove={handleDelete} />
        </Plate>
    );
};

export default MangaListPlate;
