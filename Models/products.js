const {
  Sequelize,
  UUIDV4,
  INTEGER,
  STRING,
  FLOAT,
  UUID,
} = require("sequelize");
const { sequelize } = require("../config/connectDB");

const Products = sequelize.define("Product", {
  product_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  product_name: {
    type: STRING,
    allowNull: false,
  },
  product_price: {
    type: FLOAT,
    allowNull: false,
  },
  number_in_stock: {
    type: INTEGER,
    allowNull: false,
  },
  distributor_id: {
    type: Sequelize.UUID,
    allowNull: false,
  },
});

module.exports = Products;
