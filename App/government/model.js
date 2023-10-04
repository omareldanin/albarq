const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const Tenant = require("../tenant/model");

const Government = sequelize.define("government", {
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
});

Tenant.hasMany(Government);
Government.belongsTo(Tenant);

module.exports = Government;
