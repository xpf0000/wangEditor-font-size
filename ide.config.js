/* 配置webpack出口文件路径 */
const path = require('path')
const webpack = require('webpack')
const resolve = (dir) => {
  return path.join(__dirname, dir)
}
module.exports = {
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
}
