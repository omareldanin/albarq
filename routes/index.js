module.exports = (app) => {
  app.use("/api", require("../App/region/routes"));
  app.use("/api", require("../App/branch/routes"));
  app.use("/api", require("../App/repository/routes"));
  app.use("/api", require("../App/tenant/routes"));
  app.use("/api", require("../App/user/routes"));
  app.use("/api", require("../App/store/routes"));
  app.use("/api", require("../App/category/routes"));
  app.use("/api", require("../App/product/routes"));
  app.use("/api", require("../App/notification/routes"));
};
