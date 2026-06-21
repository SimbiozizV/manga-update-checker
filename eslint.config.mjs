import * as eslintPluginEmotion from '@emotion/eslint-plugin';
import eslintReact from '@eslint-react/eslint-plugin';
import eslintReactKit, { merge } from '@eslint-react/kit';
import stylistic from '@stylistic/eslint-plugin';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

function functionComponentDefinition() {
    return (context, { collect, hint }) => {
        const { query, visitor } = collect.components(context, {
            hint: hint.component.Default & ~hint.component.DoNotIncludeFunctionDefinedAsObjectMethod,
        });

        return merge(visitor, {
            'Program:exit'(program) {
                for (const { node } of query.all(program)) {
                    if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionDeclaration') {
                        continue;
                    }

                    context.report({
                        node,
                        message: 'Function components must be defined as arrow functions or function declarations.',
                    });
                }
            },
        });
    };
}

function jsxBooleanValue() {
    return (context, { ast }) => ({
        JSXAttribute(node) {
            const { value } = node;

            if (value?.type !== 'JSXExpressionContainer') {
                return;
            }

            const expression = ast.unwrap(value.expression);

            if (expression.type !== 'Literal' || expression.value !== true) {
                return;
            }

            context.report({
                node,
                message: 'Omit the value for boolean attributes.',
                fix(fixer) {
                    if (!node.name.range || !value.range) {
                        return null;
                    }

                    return fixer.removeRange([node.name.range[1], value.range[1]]);
                },
            });
        },
    });
}

function jsxNoDuplicateProps() {
    return (context) => ({
        JSXOpeningElement(node) {
            const seen = new Set();

            for (const attribute of node.attributes) {
                if (attribute.type !== 'JSXAttribute' || attribute.name.type !== 'JSXIdentifier') {
                    continue;
                }

                if (!seen.has(attribute.name.name)) {
                    seen.add(attribute.name.name);
                    continue;
                }

                context.report({
                    node: attribute,
                    message: `Duplicate prop "${attribute.name.name}" found.`,
                });
            }
        },
    });
}

const reactKitConfig = eslintReactKit()
    .use(functionComponentDefinition)
    .use(jsxBooleanValue)
    .use(jsxNoDuplicateProps)
    .getConfig();

export default tseslint.config(
    {
        ignores: ['.yarn/**', '.pnp.cjs', '.pnp.loader.mjs', 'build/**'],
    },
    ...tseslint.configs.recommendedTypeChecked,
    eslintReact.configs['recommended-typescript'],
    reactKitConfig,
    {
        files: ['src/**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                __DEV__: 'readonly',
            },
        },
        plugins: {
            '@emotion': eslintPluginEmotion,
            '@stylistic': stylistic,
        },
        rules: {
            '@emotion/import-from-emotion': 'error',
            '@emotion/no-vanilla': 'warn',
            '@emotion/pkg-renaming': 'error',
            '@emotion/styled-import': 'error',

            '@eslint-react/dom-no-dangerously-set-innerhtml': 'warn',
            '@eslint-react/jsx-no-useless-fragment': 'warn',
            '@eslint-react/no-array-index-key': 'warn',
            '@eslint-react/no-unused-props': 'warn',

            '@stylistic/jsx-closing-tag-location': 'error',
            '@stylistic/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
            '@stylistic/jsx-indent': ['error', 4],
            '@stylistic/jsx-indent-props': ['error', 4],
            '@stylistic/jsx-pascal-case': 'error',
            '@stylistic/jsx-self-closing-comp': 'error',
            '@stylistic/jsx-wrap-multilines': [
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

            'class-methods-use-this': 'off',
            'no-alert': 'warn',
            'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
            'no-empty': ['error', { allowEmptyCatch: true }],
            'no-loop-func': 'warn',
            'no-new': 'warn',
            'no-param-reassign': ['error', { props: false }],
            'no-plusplus': 'off',
            'no-restricted-exports': 'off',
            'no-restricted-globals': 'error',
            'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
            'no-self-compare': 'error',
            'no-underscore-dangle': 'off',
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
        },
    },
    eslintPluginPrettierRecommended,
);
