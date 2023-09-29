const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  government: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  city: {
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
  },
  weight: {
    type: Sequelize.NUMBER,
    allowNull: false,
    defaultValue: 1,
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
  delivery_amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  total: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  sale: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
});

Order.beforeSave((order, options) => {
  order.total =
    order.invoice_amount + order.received_amount + order.delivery_amount;
});

module.exports = Order;
