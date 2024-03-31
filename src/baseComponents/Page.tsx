import React, { FC, PropsWithChildren } from 'react';
import Menu from '../components/Menu';
import styled from '@emotion/styled';
import AddForm from '../components/AddForm';

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px 0;
`;

const Title = styled.div`
    font-size: 24px;
    font-weight: bold;
`;

const Page: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Wrap>
            <Title>Manga update checker</Title>
            <AddForm />
            <Menu />
            {children}
        </Wrap>
    );
};

export default Page;
