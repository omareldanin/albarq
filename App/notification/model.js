const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const User = require("../user/model");

const Notification = sequelize.define("notification", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  seen: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  orderId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});

User.hasMany(Notification);
Notification.belongsTo(User);

module.exports = Notification;
