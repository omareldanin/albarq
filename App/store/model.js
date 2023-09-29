const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const User = require("../user/model");

const Branch = require("../branch/model");

const Tenant = require("../tenant/model");

const Store = sequelize.define("store", {
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
  notes: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

User.hasMany(Store);
Store.belongsTo(User);

Branch.hasMany(Store);
Store.belongsTo(Branch);

Tenant.hasMany(Store);
Store.belongsTo(Tenant);

module.exports = Store;
