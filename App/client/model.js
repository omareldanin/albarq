const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const User = require("../user/model");

const Client = sequelize.define("client", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  tenantId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});

User.hasOne(Client);
Client.belongsTo(User);

module.exports = Client;
