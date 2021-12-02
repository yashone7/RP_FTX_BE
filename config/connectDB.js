const { Sequelize } = require("sequelize");
const config = require("config");
const password = config.get("dbPassword");
const user = config.get("dbUser");
const dbName_local = config.get("dbName_local");

const sequelize = new Sequelize(dbName_local, user, password, {
  dialect: "mysql",
  host: "localhost",
  dialectOptions: {
    // ssl: {
    //   require: true,
    // },
  },
});

const connectSQLDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connected to MySQL");
  } catch (err) {
    console.error(err);
  }
};

module.exports = { sequelize, connectSQLDB };
