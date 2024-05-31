// const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// module.exports = {
//   // Set the mode to production for optimized builds
//   mode: 'production',

//   // Define the entry point of the application
//   entry: './src/index.js',

//   // Configure the output of the bundle
//   output: {
//     path: path.resolve(__dirname, 'build'),
//     filename: 'index.js',
//     libraryTarget: 'commonjs2',
//   },

//   // Define module rules
//   module: {
//     rules: [
//       // Use babel-loader to transpile JavaScript files
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: 'babel-loader',
//       },
//       // Use MiniCssExtractPlugin and css-loader to handle CSS files
//       {
//         test: /\.css$/,
//         use: [
//           MiniCssExtractPlugin.loader,
//           'css-loader',
//         ],
//       },
//       // Use file-loader to handle image and other asset files
//       {
//         test: /\.(png|jpe?g|gif|svg)$/,
//         use: [
//           {
//             loader: 'file-loader',
//             options: {
//               name: '[name].[hash].[ext]',
//               outputPath: 'assets',
//             },
//           },
//         ],
//       },
//     ],
//   },

//   // Specify externals to exclude dependencies from the output bundle
//   externals: {
//     react: 'react',
//   },

//   // Add plugins to enhance the build process
//   plugins: [
//     new MiniCssExtractPlugin({
//       filename: '[name].[contenthash].css',
//     }),
//   ],
// };

const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/GuideMeChatBot.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'GuideMeChatBot.js',
    library: 'GuideMeChatBot',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM'
    }
  },
};
