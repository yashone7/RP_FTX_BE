const { Sequelize, UUIDV4, BOOLEAN, STRING } = require("sequelize");
const { sequelize } = require("../config/connectDB");

const Retailer = sequelize.define("Retailer", {
  retailer_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  isDistributor: {
    type: BOOLEAN,
    defaultValue: false,
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

module.exports = Retailer;
