const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

let devServer = {
  hot: true,
  port: 80,
  open: true,
  noInfo: false,
  overlay: {
    warnings: true,
    errors: true
  }
}

module.exports = {
  assetsDir: 'static',
  outputDir: 'dist',
  lintOnSave: true,
  devServer: devServer,
  configureWebpack() {
    const externals =
      process.env.NODE_ENV === 'production'
        ? {
            vue: 'vue',
            'element-ui': 'element-ui',
            '@xpf0000/dom-points': '@xpf0000/dom-points',
            'script-loader': 'script-loader',
            'file-saver': 'file-saver',
            xlsx: 'xlsx',
            json2csv: 'json2csv',
            wangeditor: 'wangeditor',
            wangEditor: 'wangEditor'
          }
        : {}
    return {
      externals: externals,
      resolve: {
        alias: {
          '@': resolve('src')
        }
      },
      optimization:
        process.env.NODE_ENV === 'production'
          ? {
              minimize: true,
              minimizer: [
                new TerserPlugin({
                  terserOptions: {
                    ecma: undefined,
                    warnings: false,
                    parse: {},
                    compress: {
                      drop_console: true
                    }
                  }
                })
              ]
            }
          : {}
    }
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  css: {
    extract: false,
    requireModuleExtension: true,
    sourceMap: false,
    loaderOptions: {}
  }
}
