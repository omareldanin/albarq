const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const Product = require("../product/model");

const ProductColor = require("../productColor/model");

const ProductSize = require("../productSize/model");

const Order = require("../order/model");

const OrderProduct = sequelize.define("order_product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});

Product.hasMany(OrderProduct);
OrderProduct.belongsTo(Product);

ProductColor.hasMany(OrderProduct);
OrderProduct.belongsTo(ProductColor);

ProductSize.hasMany(OrderProduct);
OrderProduct.belongsTo(ProductSize);

Order.hasMany(OrderProduct);
OrderProduct.belongsTo(Order);

module.exports = OrderProduct;
