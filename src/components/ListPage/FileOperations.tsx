import React, { FC } from 'react';
import styled from '@emotion/styled';
import CheckIntervalSelect from './CheckIntervalSelect';
import ExportButton from './ExportButton';
import ImportButton from './ImportButton';

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Buttons = styled.div`
    display: flex;
    gap: 0 10px;
`;

const FileOperations: FC = () => {
    return (
        <Wrap>
            <CheckIntervalSelect />
            <Buttons>
                <ExportButton />
                <ImportButton />
            </Buttons>
        </Wrap>
    );
};

export default FileOperations;
