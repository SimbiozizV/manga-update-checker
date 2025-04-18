import React, { FC } from 'react';
import styled from '@emotion/styled';
import { getMaxChapterMirror } from '../../helpers/getMaxChapterMirror';
import { Manga } from '../../types/Manga';
import { MainImage } from '../PlateImage/MainImage';
import { SourceImage } from '../PlateImage/SourceImage';
import { UpgradeNotification } from '../PlateImage/UpgradeNotification';

const Source = styled(SourceImage)``;

const ImageWrap = styled.div`
    position: relative;

    ${Source} {
        position: absolute;
        top: 5px;
        left: 5px;
    }
`;

type Props = {
    manga: Manga;
    onClick?: () => void;
};

const ImageBlock: FC<Props> = ({ manga: { image, title, prevChapter, mirrors }, onClick }) => {
    return (
        <ImageWrap onClick={onClick}>
            <MainImage src={image} alt={title} />
            <UpgradeNotification
                prevChapter={prevChapter}
                lastChapter={getMaxChapterMirror(mirrors).mirror.lastChapter}
            />
        </ImageWrap>
    );
};

export default ImageBlock;
