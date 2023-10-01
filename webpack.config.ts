import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack, { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: Configuration = {
  name: 'sleact',
  mode: isDevelopment ? 'development' : 'production',
  devtool: !isDevelopment ? 'hidden-source-map' : 'eval',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // babel이 처리할 확장자 목록
    alias: {
      // ~, @, 표시 생략 가능
      '@hooks': path.resolve(__dirname, 'hooks'), // ../../../ 없애주는 코드 (TS, webpack 2개의 파일에서 처리해줘야 된다.), 코드를 타입스크림트로 치는 동안 타입스크립트 검사기가 tsconfig에서 검사를 하고, js 코드로 바꿔주는 것은 웹팩이 하는 것이기 때문에 웹팩도 설정이 필요하다.
      '@components': path.resolve(__dirname, 'components'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@typings': path.resolve(__dirname, 'typings'),
    },
  },
  entry: {
    app: './client', // client main 파일
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // module .ts 파일 or .tsx 파일을
        loader: 'babel-loader', // Babel Loader가 JS로 바꿔주는데
        options: {
          presets: [
            // babel에 대한 설정
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['last 2 chrome versions', 'IE 11'] }, // 타겟에 적어둔 브라우저를 지원하게끔 알아서 호환되도록 지원
                debug: isDevelopment,
              },
            ],
            '@babel/preset-react', // react 코드 바꿔주는 설정
            '@babel/preset-typescript',
          ],
          env: {
            development: {
              plugins: [require.resolve('react-refresh/babel')],
            },
          },
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        // Babel이 CSS 파일도 JS로 바꿔주는데 'style-loader', 'css-loader'가 그 역할을 해줌 (.css 파일들을 '{}-loader' 라는 것들이 JS 결과물로 만들어 줌)
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    // fork-ts-checker-webpack-plugin 설치
    new ForkTsCheckerWebpackPlugin({
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    // environment-plugin은 react에서 NODE_ENV라는 변수를 사용할 수 있게 만들어준다.
    // 원래 process.env.NODE_ENV는 Node runtime 에서만 사용할 수 있는 값인데
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/',
  },
  devServer: {
    historyApiFallback: true, // react router시 필요한 설정
    port: 3090,
    devMiddleware: { publicPath: '/dist/' },
    static: { directory: path.resolve(__dirname) },
    /* proxy: {
      '/api/': {
        target: 'http://localhost:3095',
        changeOrigin: true,
      },
    }, */
  },
};
// 개발환경일 때 사용할 플러그인들
if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin());
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }));
}
// 개발환경이 아닐 때 쓰일 플러그인들
if (!isDevelopment && config.plugins) {
  config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

export default config;
