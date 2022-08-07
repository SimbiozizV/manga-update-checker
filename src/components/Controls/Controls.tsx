import React, { FC } from 'react';
import UpdateButton from './UpdateButton';
import styled from '@emotion/styled';

const Wrap = styled.div`
    margin: 20px 0 15px 0;
`;

const Controls: FC = () => {
    return (
        <Wrap>
            <UpdateButton />
        </Wrap>
    );
};

export default Controls;
