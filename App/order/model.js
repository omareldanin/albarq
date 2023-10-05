const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const Branch = require("../branch/model");

const Repository = require("../repository/model");

const Tenant = require("../tenant/model");

const Client = require("../client/model");

const Region = require("../region/model");

const User = require("../user/model");

const Store = require("../store/model");

const Government = require("../government/model");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  invoice_number: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  recipient_name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  recipient_phone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM,
    values: [
      "تم تسجيل الطلب",
      "جاهز للارسال",
      "بالطريق مع المندوب",
      "تم تسليم الطلب",
      "استبدال الطلب",
      "راجع جزئى",
      "راجع كلي",
      "مؤجل",
      "تغيير العنوان",
      "اعاده الارسال",
      "عند مندوب الاستلام",
      "قيد المعالجه",
    ],
    defaultValue: "تم تسجيل الطلب",
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  details: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  order_type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  delivery_type: {
    type: Sequelize.ENUM,
    values: ["توصيل عادي", "استبدال"],
    allowNull: false,
    defaultValue: "توصيل عادي",
  },
  invoice_amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  received_amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  tenant_cost: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  delivery_amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  sale: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  forward_to: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  receipt: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

Branch.hasMany(Order);
Order.belongsTo(Branch);

Repository.hasMany(Order);
Order.belongsTo(Repository);

Client.hasMany(Order);
Order.belongsTo(Client);

Tenant.hasMany(Order);
Order.belongsTo(Tenant);

Region.hasMany(Order);
Order.belongsTo(Region);

Government.hasMany(Order);
Order.belongsTo(Government);

Store.hasMany(Order);
Order.belongsTo(Store);

User.hasMany(Order, {
  foreignKey: "deliveryId",
});
Order.belongsTo(User, {
  foreignKey: "deliveryId",
});

module.exports = Order;
