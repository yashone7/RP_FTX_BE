const { Sequelize, UUIDV4, UUID } = require("sequelize");
const { sequelize } = require("../config/connectDB");

const Favorites = sequelize.define("Favorite", {
  favorite_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  distributor_id: {
    type: UUID,
    allowNull: false,
  },
  retailer_id: {
    type: UUID,
    allowNull: false,
  },
});

module.exports = Favorites;
