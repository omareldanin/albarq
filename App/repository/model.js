const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const Branch = require("../branch/model");

const Tenant = require("../tenant/model");

const Repository = sequelize.define("repository", {
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

Branch.hasMany(Repository);
Repository.belongsTo(Branch);

Tenant.hasMany(Repository);
Repository.belongsTo(Tenant);

module.exports = Repository;
