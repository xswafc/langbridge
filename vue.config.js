const path = require('path')
const { defineConfig } = require('@vue/cli-service')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@components': resolve('src/components'),
        '@views': resolve('src/views'),
        '@assets': resolve('src/assets'),
        '@utils': resolve('src/utils'),
        '@store': resolve('src/store'),
        '~': resolve('public'),
      }
    }
  },
  
})