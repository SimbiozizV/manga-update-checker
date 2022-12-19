import React, { FC, PropsWithChildren } from 'react';
import styled from '@emotion/styled';

const Wrap = styled.div`
    width: 500px;
    max-height: 800px;
    padding: 0 20px 20px;
    background: #fff;
    overflow-y: auto;
`;

const Container: FC<PropsWithChildren> = ({ children }) => {
    return <Wrap>{children}</Wrap>;
};

export default Container;
