import React, { FC } from 'react';
import styled from '@emotion/styled';
import ExportButton from './ExportButton';
import ImportButton from './ImportButton';

const Wrap = styled.div`
    display: flex;
    gap: 0 10px;
`;

const FileOperations: FC = () => {
    return (
        <Wrap>
            <ExportButton />
            <ImportButton />
        </Wrap>
    );
};

export default FileOperations;
