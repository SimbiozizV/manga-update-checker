import React, { FC } from 'react';
import styled from '@emotion/styled';
import { getIconBySource } from '../../helpers';
import { SearchResultManga } from '../../types/search/SearchResultManga';

const ImageWrap = styled.div`
    position: relative;
`;

const Icon = styled.img`
    position: absolute;
    top: 5px;
    left: 5px;
    border: 2px solid #fff;
    border-radius: 2px;
    background: #fff;
`;

const Image = styled.img`
    display: block;
    width: 135px;
`;

type Props = Pick<SearchResultManga, 'source' | 'thumbnail'>;

const SearchResultImage: FC<Props> = ({ source, thumbnail }) => {
    return (
        <ImageWrap>
            <Icon src={getIconBySource(source)} alt="icon" />
            <Image src={thumbnail} alt="" />
        </ImageWrap>
    );
};

export default SearchResultImage;
