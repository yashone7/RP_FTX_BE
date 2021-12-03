const { validationResult } = require("express-validator");
const Order = require("../../Models/orders");
const Item = require("../../Models/items");
const { QueryTypes, UUID } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const { sequelize } = require("../../config/connectDB");

module.exports.createOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    /**
     *  [{
     *    "item_id": uniquely generated for each object,
     *    "order_id": given by the backend,
     *    "product_qty": "front_end"
     *  }]
     *
     */

    let { order_amount, client_id, distributor_id, cart_object } = req.body;

    if (cart_object.length < 1) {
      return res
        .status(400)
        .json({ message: "bad request please no product added to cart" });
    }

    const order_id = uuidv4();

    const new_cart = cart_object.map((obj) => {
      return {
        item_id: uuidv4(),
        order_id: order_id,
        ...obj,
      };
    });

    console.log(new_cart);

    let order = await Order.create(
      {
        order_id,
        order_amount,
        client_id,
        distributor_id,
      },
      { transaction: transaction }
    );

    // const query_1 = `INSERT INTO items
    // (order_id, item_id, product_id, product_price, product_qty)
    // VALUES
    // ("${order_id}", "${item_id}", "${product_id}", "${product_price}", "${product_qty}")`;

    // await sequelize.query(_.replace(query_1, /\n/g, ""), {
    //   type: QueryTypes.INSERT,
    //   transaction: transaction,
    // });

    // throw new Error({ name: "error in line 66" });

    let items = await Item.bulkCreate(new_cart, { transaction: transaction });

    await transaction.commit();

    return res.status(200).send({ message: "Order created successfully" });
  } catch (err) {
    console.log(err);
    await transaction.rollback();
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
module.exports.updateOrderById = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    let order = await Order.findOne({ where: { order_id } });
    if (_.isEmpty(order)) {
      return res
        .status(404)
        .send("No order exist in the database with given Order Id");
    }

    order.order_status = "success";
    let newOrder = await order.save();

    return res.status(200).json(newOrder);
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};
