const { Sequelize, UUIDV4, BOOLEAN, STRING } = require("sequelize");
const { sequelize } = require("../config/connectDB");

const Distributors = sequelize.define("Distributor", {
  distributor_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  isDistributor: {
    type: BOOLEAN,
    defaultValue: true,
    allowNull: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  email: {
    type: STRING,
    allowNull: false,
  },
  password: {
    type: STRING,
    allowNull: false,
  },
  phone_number: {
    type: STRING,
    allowNull: false,
  },
});

module.exports = Distributors;
