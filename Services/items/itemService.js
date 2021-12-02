const { validationResult } = require("express-validator");
const Item = require("../../Models/items");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");

module.exports.createItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { product_quantity, product_price, product_id, order_id } = req.body;

    // console.log(req.body);

    let item = await Item.findOne({ where: { order_id, product_id } });

    if (!_.isEmpty(item)) {
      return res.status(400).send({
        message: "Sorry item with the same orderId and productId already exits",
      });
    }

    const item_id = uuidv4();

    item = await Item.create({
      product_quantity,
      product_price,
      product_id,
      order_id,
      item_id,
    });

    return res.status(200).send({ message: "Item created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};
