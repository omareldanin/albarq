const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const User = require("../user/model");

const Permission = sequelize.define("permission", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  send_orders_to_delivery: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  add_page: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  add_branch: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  add_tenant: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  manage_category: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  manage_product: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  manage_employee: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  add_repository: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  add_orders: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  add_clients: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  update_client: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  update_order_total: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  update_order_status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  open_order: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  close_order: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  delete_prices: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  delete_orders: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  delete_reports: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

User.hasOne(Permission);
Permission.belongsTo(User);

module.exports = Permission;
