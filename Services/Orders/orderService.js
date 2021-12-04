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

    console.log(cart_object);

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

    return res
      .status(200)
      .send({ message: "Order created successfully", order });
  } catch (err) {
    console.log(err);
    await transaction.rollback();
    return res.status(500).send("server error");
  }
};

module.exports.getAllOrdersByDistributorId = async (req, res, next) => {
  try {
    const { distributor_id } = req.params;
    let orders = await Order.findAll({ where: { distributor_id } });
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
module.exports.getAllOrdersByRetailer = async (req, res, next) => {
  try {
    const { client_id, distributor_id } = req.params;
    let orders = await Order.findAll({ where: { client_id, distributor_id } });
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
    const { order_id, transaction_id } = req.query;
    let order = await Order.findOne({ where: { order_id } });
    if (_.isEmpty(order)) {
      return res
        .status(404)
        .send("No order exist in the database with given Order Id");
    }

    console.log("working");

    order.order_status = "success";
    order.transaction_id = transaction_id;
    let newOrder = await order.save();

    return res.status(200).json(newOrder);
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};

module.exports.getTotalSale = async (req, res, next) => {
  try {
    const sale = await sequelize.query(`CALL get_total_sale()`, {
      type: QueryTypes.RAW,
    });

    if (_.isEmpty(sale)) {
      return res.status(404).json({ message: "no records found", sale });
    }

    return res.status(200).json(sale);
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};

module.exports.getSaleByRetailerId = async (req, res, next) => {
  try {
    const { retailer_id } = req.params;

    const sale = await sequelize.query(
      `
    SELECT o.order_id, 
    o.order_amount, 
    r.retailer_id, 
    d.distributor_id, 
    r.name AS retailer_name, 
    d.name AS distributor_name, 
    r.location, r.pincode,
    o.createdAt  
    FROM orders o INNER JOIN retailers r ON
    o.client_id = r.retailer_id INNER JOIN distributors d ON
    d.distributor_id = o.distributor_id
    WHERE 
    CAST(o.createdAt AS DATETIME) 
    BETWEEN CAST('2021-12-02 14:15:55' AS DATETIME) 
    AND 
    CAST('2021-12-04 14:15:55' AS DATETIME) 
    AND r.retailer_id = "${retailer_id}";
    `,
      { type: QueryTypes.SELECT }
    );

    if (_.isEmpty(sale)) {
      return res.status(404).json({ message: "no records found", sale });
    }

    return res.status(200).json(sale);
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};

module.exports.getSaleByRetailerBetweenDates = async (req, res, next) => {
  try {
    const { retailer_id, start_date, end_date } = req.query;

    // console.log(start_date, end_date);

    const sale = await sequelize.query(
      `
    SELECT o.order_id, 
    o.order_amount, 
    r.retailer_id, 
    d.distributor_id, 
    r.name AS retailer_name, 
    d.name AS distributor_name, 
    r.location, r.pincode,
    o.createdAt  
    FROM orders o INNER JOIN retailers r ON
    o.client_id = r.retailer_id INNER JOIN distributors d ON
    d.distributor_id = o.distributor_id
    WHERE 
    CAST(o.createdAt AS DATETIME) 
    BETWEEN CAST("${start_date}" AS DATETIME) 
    AND 
    CAST("${end_date}" AS DATETIME) 
    AND r.retailer_id = "${retailer_id}";
    `,
      { type: QueryTypes.SELECT }
    );

    if (_.isEmpty(sale)) {
      return res.status(404).json({ message: "no records found", sale });
    }

    console.log(sale);

    return res.status(200).json(sale);
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};

module.exports.getTotalSaleBetweendates = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.params;

    // console.log(start_date, end_date);

    const sale = await sequelize.query(
      `
    SELECT o.order_id, 
    o.order_amount, 
    r.retailer_id, 
    d.distributor_id, 
    r.name AS retailer_name, 
    d.name AS distributor_name, 
    r.location, r.pincode,
    o.createdAt  
    FROM orders o INNER JOIN retailers r ON
    o.client_id = r.retailer_id INNER JOIN distributors d ON
    d.distributor_id = o.distributor_id
    WHERE 
    CAST(o.createdAt AS DATETIME) 
    BETWEEN CAST("${start_date}" AS DATETIME) 
    AND 
    CAST("${end_date}" AS DATETIME);
    `,
      { type: QueryTypes.SELECT }
    );

    if (_.isEmpty(sale)) {
      return res.status(404).json({ message: "no records found", sale });
    }

    console.log(sale);

    return res.status(200).json(sale);
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};
