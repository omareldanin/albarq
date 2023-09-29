const Sequelize = require("sequelize");

// const sequelize = new Sequelize({
//   host: "127.0.0.1",
//   port: "3306",
//   database: "Albarq",
//   username: "root",
//   password: "",
//   dialect: "mysql",
// });

const sequelize = new Sequelize({
  host: "talabatek.cataddxqm8fj.eu-north-1.rds.amazonaws.com",
  port: "3306",
  database: "albarq",
  username: "admin",
  password: "talabatek",
  dialect: "mysql",
});

module.exports = sequelize;
