const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/ipapi",
    createProxyMiddleware({
      target: "https://ipapi.co",
      changeOrigin: true,
      pathRewrite: { "^/ipapi": "" },
    })
  );
};
