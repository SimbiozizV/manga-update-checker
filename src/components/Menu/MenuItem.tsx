import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { MenuItem as MenuItemType } from '../../types/Menu';
import styled from '@emotion/styled';

const Link = styled(NavLink)`
    display: block;
    padding: 10px 10px 8px 10px;
    text-decoration: none;
    color: #333;
    border-bottom: 1px solid transparent;

    &:hover {
        color: #777;
    }

    &:hover,
    &.active {
        border-bottom: 2px solid #1677ff;
        transition: border-bottom-color 0.4s;
    }
`;

const MenuItem: FC<MenuItemType> = ({ url, text }) => {
    return <Link to={url}>{text}</Link>;
};

export default MenuItem;
