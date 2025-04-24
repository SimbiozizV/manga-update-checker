import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { SourceType } from '../../../enum';
import { useAppDispatch } from '../../../hooks';
import { readManga, removeManga, mirrorUrlChange, removeMirror } from '../../../state/slices/mangaPage';
import { Manga } from '../../../types/Manga';
import ImageBlock from '../ImageBlock';
import { DeleteButton } from './DeleteButton';
import { ListPlateData } from './ListPlateData';
import { SourceEditForm } from './SourceEditForm';

const Plate = styled.div<{ isMirrorEdit: boolean }>`
    display: grid;
    grid-template-columns: ${({ isMirrorEdit }) => (isMirrorEdit ? '145px 1fr' : '145px 1fr 32px')};
    gap: 10px;
`;

type Props = {
    manga: Manga;
};

export const ListPlate: FC<Props> = ({ manga }) => {
    const dispatch = useAppDispatch();
    const [source, setSource] = useState<null | SourceType>(null);

    const handlePlateClick = () => {
        dispatch(readManga(manga.id));
    };

    const handleDelete = () => {
        dispatch(removeManga(manga.id));
    };

    const handleOnCancel = () => {
        setSource(null);
    };

    const handleMirrorChange = async (url: string) => {
        await dispatch(mirrorUrlChange({ id: manga.id, source: source!, url }));
        setSource(null);
    };

    const handleMirrorDelete = (source: SourceType) => {
        dispatch(removeMirror({ mangaId: manga.id, source }));
        setSource(null);
    };

    return (
        <Plate isMirrorEdit={Boolean(source)}>
            <ImageBlock manga={manga} onClick={handlePlateClick} />

            {source ? (
                <SourceEditForm
                    source={source}
                    mirror={manga.mirrors[source]!}
                    onSave={handleMirrorChange}
                    onCancel={handleOnCancel}
                    onDelete={handleMirrorDelete}
                />
            ) : (
                <>
                    <ListPlateData manga={manga} onSourceClick={setSource} />
                    <DeleteButton onDelete={handleDelete} />
                </>
            )}
        </Plate>
    );
};
