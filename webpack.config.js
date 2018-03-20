const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
process.env.NODE_ENV = env 

module.exports = {
  mode: env,
  entry: './src/index.js',
  devtool: ((env === 'production') ? 'none' : 'source-map'),
  output: {
    path: `${__dirname}/build`,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      }
    ]
  }
}