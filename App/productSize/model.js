const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const Product = require("../product/model");

const ProductColor = require("../productColor/model");

const ProductSize = sequelize.define("product_size", {
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
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  available: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

Product.hasMany(ProductSize);
ProductSize.belongsTo(Product);

ProductColor.hasMany(ProductSize);
ProductSize.belongsTo(ProductColor);

module.exports = ProductSize;
