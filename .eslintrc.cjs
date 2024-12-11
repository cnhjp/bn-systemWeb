module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'vue'],
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-essential',
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        'plugin:prettier/recommended',
        'prettier',
    ],
    globals: {},
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
        {
            files: ['*.ts'],
            rules: {
                'no-unused-expressions': 'off',
            },
        },
        {
            files: ['*.vue'],
            rules: {
                'no-undef': 'off',
            },
        },
    ],
    rules: {
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-debugger': 'off',
        'prettier/prettier': 'error',
    },
}
