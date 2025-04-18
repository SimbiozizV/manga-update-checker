import React, { FC, PropsWithChildren } from 'react';
import styled from '@emotion/styled';
import Menu from '../components/Menu';
import { Header } from './Header';

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px 0;
`;

const Page: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Wrap>
            <Header />
            <Menu />
            {children}
        </Wrap>
    );
};

export default Page;
