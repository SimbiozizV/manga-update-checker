import React, { FC } from 'react';
import { getIconBySource } from '../../helpers';
import styled from '@emotion/styled';
import { Manga } from '../../types/Manga';

const ImageWrap = styled.div`
    position: relative;
`;

const MainImage = styled.img`
    height: 135px;
    width: 135px;
    object-fit: cover;
    object-position: center;
`;

const SourceImage = styled.img`
    position: absolute;
    top: 5px;
    left: 5px;
    border: 2px solid #fff;
    border-radius: 2px;
    background: #fff;
`;

const UpgradeNotification = styled.div`
    position: absolute;
    left: 5px;
    bottom: 10px;
    font-size: 12px;
    font-weight: 600;
    padding: 2px 5px;
    border-radius: 4px;
    color: white;
    background: #52c41a;
`;

type Props = {
    manga: Manga;
    onClick?: () => void;
};

const ImageBlock: FC<Props> = ({ manga: { image, title, source, prevChapter, lastChapter }, onClick }) => {
    const showUpgradeNotification = prevChapter !== lastChapter;

    return (
        <ImageWrap onClick={onClick}>
            <SourceImage src={getIconBySource(source)} alt="icon" />
            <MainImage src={image} alt={title} />
            {showUpgradeNotification && (
                <UpgradeNotification>
                    {prevChapter} &gt; {lastChapter}
                </UpgradeNotification>
            )}
        </ImageWrap>
    );
};

export default ImageBlock;
