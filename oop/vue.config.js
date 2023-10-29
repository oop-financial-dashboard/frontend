// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   devServer: {
//     proxy: 'http://localhost:8088/api/v1',
//   }
// })

// --- analytics-api port connection --- //
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: 'http://localhost:8082/'
  }
})