module.exports = (api) => {
  const babelEnv = api.env();
  const plugins = [
    [
      'module-resolver',
      {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.android.js',
          '.android.tsx',
          '.ios.js',
          '.ios.tsx',
        ],
        root: ['.'],
        alias: {
          features: './src/features',
          components: './src/components',
          store: './src/store',
          util: './src/util',
          styles: './src/styles',
          nav: './src/nav',
          services: './src/services',
          screens: './src/screens',
          assets: './assets',
          lang: './src/lang',
          constants: './src/constants',
        },
      },
    ],
  ];
  if (babelEnv !== 'development') {
    plugins.push(['transform-remove-console', { exclude: ['error', 'warn'] }]);
  }

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins,
  };
};
