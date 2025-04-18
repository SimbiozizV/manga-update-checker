import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Empty as AntdEmpty } from 'antd';

const StyledEmpty = styled(AntdEmpty)<{ margin?: string }>`
    ${({ margin }) => margin && `margin: ${margin};`}
`;

type Props = {
    description: string;
    margin?: string;
};

const Empty: FC<Props> = ({ description, margin }) => {
    return <StyledEmpty description={description} margin={margin} />;
};

export default Empty;
