const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const User = require("../user/model");

const Client = require("../client/model");

const ClientAssistant = sequelize.define("client_assistant", {
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

User.hasOne(ClientAssistant);
ClientAssistant.belongsTo(User);

Client.hasMany(ClientAssistant);
ClientAssistant.belongsTo(Client);

module.exports = ClientAssistant;
