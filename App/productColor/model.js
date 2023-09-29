const Sequelize = require("sequelize");

const sequelize = require("../../util/database");
const Product = require("../product/model");

const ProductColor = sequelize.define("product_color", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  available: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

Product.hasMany(ProductColor);
ProductColor.belongsTo(Product);

module.exports = ProductColor;
