module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./src'],
                extensions: [
                    '.ios.ts',
                    '.android.ts',
                    '.ts',
                    '.ios.tsx',
                    '.android.tsx',
                    '.tsx',
                    '.jsx',
                    '.js',
                    '.json',
                ],
                alias: {
                    components: './src/components',
                    app: './src/app',
                    utils: './src/utils',
                    types: './src/types',
                    store: './src/store',
                    modules: './src/modules',
                    theme: './src/theme',
                    navigation: './src/navigation',
                    assets: './src/assets',
                    config: './src/config',
                    hooks: './src/hooks',
                    styles: './src/styles',
                    static: './src/static',
                    i18n: './src/i18n',
                },
            },
        ],
    ],
};
