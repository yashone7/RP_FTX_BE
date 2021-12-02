const { validationResult } = require("express-validator");
const Favorite = require("../../Models/favorites");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");

module.exports.createFavorite = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { retailer_id, distributor_id } = req.body;
    let favorite = await Favorite.findOne({
      where: { retailer_id, distributor_id },
    });

    if (!_.isEmpty(favorite)) {
      return res.status(404).send({
        message:
          "Favorite with the given distributor_id and retailer_id already exists",
      });
    }
    const favorite_id = uuidv4();

    favorite = await Favorite.create({
      favorite_id,
      retailer_id,
      distributor_id,
    });

    return res.status(200).send({ message: "Favorite created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};
module.exports.deleteFavorite = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { retailer_id, distributor_id } = req.body;
    let favorite = await Favorite.findOne({
      where: { retailer_id, distributor_id },
    });

    if (_.isEmpty(favorite)) {
      return res.status(404).send({
        message:
          "Favorite with the given distributor_id and retailer_id doesn't exist",
      });
    }
    favorite = await Favorite.destroy({
      where: { retailer_id, distributor_id },
    }).then(
      function (rowDeleted) {
        if (rowDeleted === 1) {
          return res.status(200).send({
            message: "Favorite deleted successfully",
          });
        }
      },
      function (err) {
        return res.status(404).send({
          message: "Couldnt delete for some reason",
        });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};
