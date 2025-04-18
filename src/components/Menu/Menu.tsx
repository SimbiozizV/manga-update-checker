import React, { FC } from 'react';
import styled from '@emotion/styled';
import MenuItem from './MenuItem';
import menuMap from './menuMap';

const Wrap = styled.div`
    display: flex;
    gap: 0 10px;
    border-bottom: 1px solid #ccc;
`;

const Menu: FC = () => {
    return (
        <Wrap>
            {menuMap.map(item => (
                <MenuItem key={item.url} {...item} />
            ))}
        </Wrap>
    );
};

export default Menu;
