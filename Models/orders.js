const {
  Sequelize,
  UUIDV4,
  FLOAT,
  UUID,
  DataTypes,
  // DATETIME,
} = require("sequelize");
const { sequelize } = require("../config/connectDB");
// const { formatISO } = require("date-fns");

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
    defaultValue: "pending",
    allowNull: false,
  },
  distributor_id: {
    type: UUID,
    allowNull: false,
  },
  // order_date: {
  //   type: DATETIME,
  //   defaultValue: formatISO(Date.now()),
  //   allowNull: false,
  // },
});

module.exports = Orders;
