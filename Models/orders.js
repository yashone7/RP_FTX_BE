const {
  Sequelize,
  UUIDV4,
  FLOAT,
  UUID,
  DataTypes,
  DATE,
} = require("sequelize");
const { sequelize } = require("../config/connectDB");

const Orders = sequelize.define("Order", {
  order_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  order_amount: {
    type: FLOAT,
    allowNull: false,
  },
  client_id: {
    type: UUID,
    allowNull: false,
  },
  order_status: {
    type: DataTypes.ENUM("success", "pending", "failed"),
    allowNull: false,
  },
  distributor_id: {
    type: UUID,
    allowNull: false,
  },
  order_date: {
    type: DATE,
    allowNull: false,
  },
});

module.exports = Orders;
