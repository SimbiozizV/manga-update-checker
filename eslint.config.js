const babelParser = require('@babel/eslint-parser');
const eslintPluginImport = require('eslint-plugin-import');
const eslintPluginReact = require('eslint-plugin-react');
const eslintPluginReactHooks = require('eslint-plugin-react-hooks');
const eslintPluginPrettier = require('eslint-plugin-prettier');
const eslintPluginEmotion = require('@emotion/eslint-plugin');

module.exports = [
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    presets: ['@babel/preset-react'],
                },
            },
            sourceType: 'module',
            globals: {
                __DEV__: 'readonly',
            },
        },
        plugins: {
            import: eslintPluginImport,
            react: eslintPluginReact,
            'react-hooks': eslintPluginReactHooks,
            prettier: eslintPluginPrettier,
            '@emotion': eslintPluginEmotion,
        },
        settings: {
            react: {
                version: 'detect',
            },
            'import/parsers': {
                '@typescript-eslint/parser': ['.ts', '.tsx'],
            },
            'import/resolver': {
                'babel-module': {
                    cwd: __dirname,
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
            },
        },
        rules: {
            'import/extensions': [
                'error',
                'ignorePackages',
                {
                    js: 'never',
                    jsx: 'never',
                    ts: 'never',
                    tsx: 'never',
                },
            ],
            'import/first': 'off',
            'import/prefer-default-export': 'off',
            'prettier/prettier': 'error',
            'no-console': 'off',
            'no-alert': 'off',
            'no-new': 'off',
            'no-empty': 'off',
            'no-loop-func': 'off',
            'no-param-reassign': ['error', { props: false }],
            'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
            'no-plusplus': 'off',
            'no-underscore-dangle': 'off',
            'arrow-parens': 'off',
            'arrow-body-style': 'off',
            'function-paren-newline': 'off',
            'implicit-arrow-linebreak': 'off',
            'wrap-iife': ['error', 'any'],
            'comma-dangle': [
                'error',
                {
                    arrays: 'always-multiline',
                    objects: 'always-multiline',
                    imports: 'only-multiline',
                    exports: 'only-multiline',
                    functions: 'only-multiline',
                },
            ],
            'prefer-destructuring': [
                'error',
                {
                    VariableDeclarator: {
                        array: false,
                        object: true,
                    },
                    AssignmentExpression: {
                        array: false,
                        object: false,
                    },
                },
                {
                    enforceForRenamedProperties: false,
                },
            ],
            'max-len': [
                'error',
                120,
                4,
                {
                    ignoreUrls: true,
                    ignoreComments: false,
                    ignoreRegExpLiterals: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignorePattern: '<path([sS]*?)/>',
                },
            ],
            '@emotion/pkg-renaming': 'error',
            'react/no-danger': 'off',
            'react/require-default-props': 'off',
            'react/function-component-definition': 'off',
            'react/jsx-wrap-multilines': [
                'error',
                {
                    declaration: 'parens-new-line',
                    assignment: 'parens-new-line',
                    return: 'parens-new-line',
                    arrow: 'parens-new-line',
                    condition: 'parens-new-line',
                    logical: 'parens-new-line',
                    prop: 'ignore',
                },
            ],
            'react/jsx-indent': ['error', 4],
            'react/jsx-indent-props': ['error', 4],
            'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx', '.mdx'] }],
            'react/forbid-prop-types': 'off',
            'react/jsx-closing-tag-location': 'off',
            'react/jsx-one-expression-per-line': 'off',
            'react/no-unused-prop-types': 'off',
            'react/static-property-placement': 'off',
            'react/destructuring-assignment': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
];
