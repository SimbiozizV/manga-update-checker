import React, { FC, PropsWithChildren } from 'react';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import styled from '@emotion/styled';

const Title = styled.div`
    color: #ff4d4f;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
`;

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px 0;
    background: #fff2f0;
    border: 1px solid #ffccc7;
    border-radius: 4px;
    padding: 10px 10px;
`;

const ProblemBlock: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Wrap>
            <Title>
                <WarningOutlined /> Не смогли получить данные <WarningOutlined />
            </Title>
            <div>Проверьте открывается ли у вас страница с мангой. Попробуйте обновиться позже.</div>
            {children}
        </Wrap>
    );
};

export default ProblemBlock;
