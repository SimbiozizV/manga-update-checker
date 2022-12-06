import React from 'react';
import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
    <Global
        styles={css`
            * {
                box-sizing: border-box;
            }

            html,
            body {
                padding: 0;
                margin: 0;
            }
        `}
    />
);

export default GlobalStyles;
