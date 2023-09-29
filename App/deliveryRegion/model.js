const Sequelize = require("sequelize");

const sequelize = require("../../util/database");
const User = require("../user/model");
const Region = require("../region/model");

const DeliveryRegion = sequelize.define("delivery_region", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

User.belongsToMany(Region, { through: DeliveryRegion });
Region.belongsToMany(User, { through: DeliveryRegion });

module.exports = DeliveryRegion;
