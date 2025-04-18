import React, { FC } from 'react';
import styled from '@emotion/styled';

const Notification = styled.div`
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
    prevChapter: string;
    lastChapter: string;
};

export const UpgradeNotification: FC<Props> = ({ prevChapter, lastChapter }) => {
    if (prevChapter === lastChapter) return null;

    return (
        <Notification>
            {prevChapter} &gt; {lastChapter}
        </Notification>
    );
};
