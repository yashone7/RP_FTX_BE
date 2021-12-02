const { validationResult } = require("express-validator");
const Order = require("../../Models/orders");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");

module.exports.createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { order_amount, order_status, client_id, distributor_id, order_date } =
      req.body;

    console.log(req.body);

    // let order = await Order.findOne({ where: { product_name } });

    // if (!_.isEmpty(product)) {
    //   return res.status(400).send({
    //     message: "Sorry product with the same name already exists",
    //   });
    // }

    const order_id = uuidv4();

    let order = await Order.create({
      order_id,
      order_amount,
      order_status,
      client_id,
      distributor_id,
      order_date,
    });

    return res.status(200).send({ message: "Order created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};

module.exports.getAllOrdersByDistributorId = async (req, res, next) => {
  try {
    const { client_id } = req.params;
    let orders = await Order.findAll({ where: { client_id } });
    if (_.isEmpty(orders)) {
      return res
        .status(404)
        .send("No orders exist in the database with given retailer id");
    }
    return res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};
module.exports.getOrderById = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    console.log(req.params);
    let order = await Order.findAll({
      where: { order_id },
    });
    if (_.isEmpty(order)) {
      return res
        .status(404)
        .send("No order exist in the database with given Order Id");
    }
    return res.status(200).json(order);
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};
