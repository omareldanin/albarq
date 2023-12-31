const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const Tenant = require("../tenant/model");

const Branch = require("../branch/model");

const User = require("../user/model");

const Government = require("../government/model");

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
});

Tenant.hasMany(Region);
Region.belongsTo(Tenant);

Branch.hasMany(Region);
Region.belongsTo(Branch);

Government.hasMany(Region);
Region.belongsTo(Government);

User.hasMany(Region, {
  foreignKey: "deliveryId",
});
Region.belongsTo(User, {
  foreignKey: "deliveryId",
});
module.exports = Region;
