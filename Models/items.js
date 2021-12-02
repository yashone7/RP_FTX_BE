const { Sequelize, UUIDV4, FLOAT, INTEGER } = require("sequelize");
const { sequelize } = require("../config/connectDB");

const Items = sequelize.define("Item", {
  item_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  product_id: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  product_price: {
    type: FLOAT,
    allowNull: false,
  },
  product_quantity: {
    type: INTEGER,
    allowNull: false,
  },
  order_id: {
    type: Sequelize.UUID,
    allowNull: false,
  },
});

module.exports = Items;
