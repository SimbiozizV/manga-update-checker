import React, { FC, MouseEvent } from 'react';
import { WarningOutlined } from '@ant-design/icons';
import { Manga } from '../../types/Manga';
import { Tag, Typography } from 'antd';
import styled from '@emotion/styled';
import MangaRemoveButton from './MangaRemoveButton';
import { getIconBySource } from '../../helpers';
import { MangaStatus } from '../../enum';
import showNotification from '../../helpers/showNotification';
import { NOTIFICATION } from '../../constants/text';

const WarningIcon = styled(WarningOutlined)`
    color: #ff4d4f;
`;

const NoWrap = styled.span`
    white-space: nowrap;
`;

const BlockWrap = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0 8px;
    width: 100%;

    .ant-tag {
        margin-right: 0;
    }
`;

const InfoWrap = styled.div`
    display: flex;
    gap: 0 8px;
    align-items: center;
`;

type Props = {
    manga: Manga;
    onRemove: (url: string) => void;
    onRedirect: (url: string) => void;
};

const MangaListItem: FC<Props> = ({
    manga: { title, url, source, status, lastChapter, prevChapter },
    onRemove,
    onRedirect,
}) => {
    const hasNewChapter = lastChapter !== prevChapter;
    const iconUrl = getIconBySource(source);

    const onLinkClick = (e: MouseEvent) => {
        e.preventDefault();
        showNotification({
            title: NOTIFICATION.title,
            message: NOTIFICATION.message(prevChapter),
            iconUrl,
        });
        onRedirect(url);
    };

    const onRemoveClick = () => {
        onRemove(url);
    };

    return (
        <BlockWrap>
            <InfoWrap>
                <img src={iconUrl} alt="icon" />
                <Typography.Link href={url} target="_blank" onClick={onLinkClick}>
                    {title}
                </Typography.Link>{' '}
                {status === MangaStatus.Error && <WarningIcon />}
                {hasNewChapter ? (
                    <>
                        <NoWrap>{`(${prevChapter} > ${lastChapter})`}</NoWrap>
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
