import React, { FC, MouseEvent } from 'react';
import { Manga } from '../../types/Manga';
import { Tag, Typography } from 'antd';
import styled from '@emotion/styled';
import MangaRemoveButton from '../MangaRemoveButton';
import getIconBySource from '../../helpers/getIconBySource';

const BlockWrap = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0 20px;
    width: 100%;
`;

const InfoWrap = styled.div`
    display: flex;
    gap: 0 5px;
    align-items: center;
`;

type Props = {
    manga: Manga;
    onRemove: (url: string) => void;
    onRedirect: (url: string) => void;
};

const MangaListItem: FC<Props> = ({
    manga: { title, url, source, lastChapter, prevChapter },
    onRemove,
    onRedirect,
}) => {
    const hasNewChapter = lastChapter !== prevChapter;

    const onLinkClick = (e: MouseEvent) => {
        e.preventDefault();
        onRedirect(url);
    };

    const onRemoveClick = () => {
        onRemove(url);
    };

    return (
        <BlockWrap>
            <InfoWrap>
                <img src={getIconBySource(source)} alt="icon" />
                <Typography.Link href={url} target="_blank" onClick={onLinkClick}>
                    {title}
                </Typography.Link>{' '}
                {hasNewChapter ? (
                    <>
                        <span>{`(${prevChapter} > ${lastChapter})`}</span>
                        <Tag color="green">NEW</Tag>
                    </>
                ) : (
                    `(${lastChapter})`
                )}
            </InfoWrap>
            <MangaRemoveButton onRemove={onRemoveClick} />
        </BlockWrap>
    );
};

export default MangaListItem;
