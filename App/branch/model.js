const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const Tenant = require("../tenant/model");

const Government = require("../government/model");

const Branch = sequelize.define("branch", {
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
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

Tenant.hasMany(Branch);
Branch.belongsTo(Tenant);

Government.hasMany(Branch);
Branch.belongsTo(Government);

module.exports = Branch;
