const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Change '/api' to match the base URL of your API
    createProxyMiddleware({
      target: 'http://localhost:5000', // Change the target URL to match your server's URL
      changeOrigin: true,
    })
  );
};