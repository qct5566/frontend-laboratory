const path = require('path')
// const fs = require('fs')
const webpack = require('webpack')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const createThemeColorReplacerPlugin = require('./src/config/plugin.config')

const resolve = dir => path.join(__dirname, dir)
const isDev = process.env.NODE_ENV === 'development'
// const postcssPx2remExcludeOption = require(`./src/utils/postcssPx2remExcludeOption`)

const vueConfig = {
  publicPath: !isDev ? '../' : '/',
  outputDir: 'dist',
  assetsDir: 'webapp',
  // filenameHashing: false,
  devServer: {
    port: 8888,
    // open: true,
    proxy: {
      '/': {
        target: process.env.VUE_PROXY_URL,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        },
        ws: false
      }
    },
    overlay: {
      warnings: true,
      errors: true
    }
  },
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
      // new CopyWebpackPlugin([{ from: resolve('src/utils/context.js'), to: 'webapp' }])
    ]
    // if prod is on, add externals
    // externals: isProd() ? prodExternals : {}
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
    if (isDev) {
      config.module.rule('eslint').use('eslint-loader').loader('eslint-loader').tap(opt => {
        opt.emitWarning = opt.emitError = opt.failOnWarning = opt.failOnError = true
        return opt
      })
    }
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'webapp/assets/[name].[hash:8].[ext]'
      })
  },

  css: {
    sourceMap: true,
    loaderOptions: {
      // postcss: {
      // plugins: [
      //   require('postcss-px2rem-exclude')({
      //     ...postcssPx2remExcludeOption.plugins['postcss-px2rem-exclude']
      //   })
      // ]
      // },
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          /*
          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
          */
        },
        javascriptEnabled: true
      }
    }
  },
  productionSourceMap: false,
  lintOnSave: isDev ? 'error' : true,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}
// preview.pro.loacg.com only do not use in your production;
// if (process.env.VUE_APP_PREVIEW === 'true') {
//   console.log('VUE_APP_PREVIEW', true)
//   // add `ThemeColorReplacer` plugin to webpack plugins
//   vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
// }

module.exports = vueConfig
