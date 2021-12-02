const { Sequelize, UUIDV4 } = require("sequelize");
const { sequelize } = require("../config/connectDB");

const Invoice = sequelize.define("Invoice", {
  invoice_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  order_id: {
    type: Sequelize.UUID,
    allowNull: false,
  },
});

module.exports = Invoice;
