const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const User = require("../user/model");

const Category = sequelize.define("category", {
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

User.hasMany(Category);
Category.belongsTo(User);

module.exports = Category;
