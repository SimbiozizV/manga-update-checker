import React, { FC } from 'react';
import styled from '@emotion/styled';
import { SourceType } from '../../enum';
import { getIconBySource } from '../../helpers';

const Image = styled.img`
    border: 2px solid #fff;
    border-radius: 2px;
    background: #fff;
`;

type Props = {
    source: SourceType;
} & ClassName;

export const SourceImage: FC<Props> = ({ source, className }) => {
    return <Image src={getIconBySource(source)} className={className} alt="icon" />;
};
