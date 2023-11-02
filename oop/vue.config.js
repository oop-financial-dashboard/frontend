const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: 'https://azure-oop-smux-gateway.azuremicroservices.io/api',
  }
})