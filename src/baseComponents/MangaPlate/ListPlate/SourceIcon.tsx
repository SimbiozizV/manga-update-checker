import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Tooltip } from 'antd';
import { SourceType } from '../../../enum';
import { getIconBySource } from '../../../helpers';

type Props = {
    source: SourceType;
    lastChapter?: string;
    onClick: (source: SourceType) => void;
};

const Wrap = styled.div`
    cursor: pointer;

    img:hover {
        transform: scale(1.1);
    }
`;

export const SourceIcon: FC<Props> = ({ source, lastChapter, onClick }) => {
    const handleClick = () => {
        onClick(source);
    };

    return (
        <Tooltip key={source} title={`Глава ${lastChapter}`}>
            <Wrap onClick={handleClick}>
                <img src={getIconBySource(source)} alt="icon" />
            </Wrap>
        </Tooltip>
    );
};
