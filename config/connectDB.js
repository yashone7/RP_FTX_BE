const { Sequelize } = require("sequelize");
const config = require("config");
const password = config.get("dbPassword");
const user = config.get("dbUser");
const dbName_local = config.get("dbName_local");
const dbUser_remote = config.get("dbUser_remote");
const dbHost_remote = config.get("dbHost_remote");
const dbPassword_remote = config.get("dbPassword_remote");

const sequelize = new Sequelize(
  dbName_local,
  dbUser_remote,
  dbPassword_remote,
  {
    dialect: "mysql",
    host: dbHost_remote,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  }
);

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
