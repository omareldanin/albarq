const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const Tenant = require("../tenant/model");

const Branch = require("../branch/model");

const Region = sequelize.define("region", {
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
  government: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  city: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

Tenant.hasMany(Region);
Region.belongsTo(Tenant);

Branch.hasMany(Region);
Region.belongsTo(Branch);

module.exports = Region;
