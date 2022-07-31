import React, { FC, MouseEvent } from 'react';
import { Manga } from '../types/Manga';
import { Tag, Typography } from 'antd';
import readMangaIcon from '../images/readmanga.png';
import styled from '@emotion/styled';
import { useAppDispatch } from '../hooks';
import { removeManga } from '../state/slices';
import MangaRemoveButton from './MangaRemoveButton';
import markReadMangaInStore from '../helpers/markReadMangaInStore';

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

const MangaListItem: FC<Manga> = ({ title, url, lastChapter, prevChapter }) => {
    const dispatch = useAppDispatch();
    const hasNewChapter = lastChapter !== prevChapter;

    const onLinkClick = (e: MouseEvent) => {
        e.preventDefault();
        markReadMangaInStore(url).then(() => {
            chrome.tabs.create({ url, active: true });
        });
    };

    const onRemove = () => {
        dispatch(removeManga(url));
    };

    return (
        <BlockWrap>
            <InfoWrap>
                <img src={readMangaIcon} alt="icon" />
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
            <MangaRemoveButton onRemove={onRemove} />
        </BlockWrap>
    );
};

export default MangaListItem;
