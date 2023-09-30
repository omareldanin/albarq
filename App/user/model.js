const Sequelize = require("sequelize");

const sequelize = require("../../util/database");

const Branch = require("../branch/model");

const Repository = require("../repository/model");

const Tenant = require("../tenant/model");

const User = sequelize.define("user", {
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
  image: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  fcm: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  account_type: {
    type: Sequelize.ENUM,
    values: ["client", "client assistant", "employee", "admin"],
    allowNull: false,
    defaultValue: "employee",
  },
  role: {
    type: Sequelize.ENUM,
    values: [
      "مدير الشركه",
      "مدير الحسابات",
      "محاسب",
      "مندوب توصيل",
      "مدير فرع",
      "موظف طوارئ",
      "مدخل بيانات",
      "موظف مخزن",
      "موظف مخزن",
    ],
    allowNull: true,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  salary: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  super_admin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  createdBy: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

Branch.hasMany(User);
User.belongsTo(Branch);

Tenant.hasMany(User);
User.belongsTo(Tenant);

Repository.hasMany(User);
User.belongsTo(Repository);

module.exports = User;
