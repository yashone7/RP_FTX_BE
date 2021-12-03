const { validationResult } = require("express-validator");
const Product = require("../../Models/products");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");

module.exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { product_name, product_price, number_in_stock, distributor_id } =
      req.body;

    console.log(req.body);

    let product = await Product.findOne({ where: { product_name } });

    if (!_.isEmpty(product)) {
      return res.status(400).send({
        message: "Sorry product with the same name already exists",
      });
    }

    const product_id = uuidv4();

    product = await Product.create({
      product_name,
      product_price,
      number_in_stock,
      distributor_id,
    });

    return res.status(200).send({ message: "Product created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};

module.exports.getAllProducts = async (req, res, next) => {
  try {
    let products = await Product.findAll();
    if (_.isEmpty(products)) {
      return res.status(404).send("No products exist in the database");
    }
    return res.status(200).json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};
module.exports.getProductById = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    console.log(req.params);
    let products = await Product.findAll({
      where: { product_id },
    });
    if (_.isEmpty(products)) {
      return res
        .status(404)
        .send("No products exist in the database with given Product Id");
    }
    return res.status(200).json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};

module.exports.getProductsByDistributorId = async (req, res, next) => {
  try {
    const { distributor_id } = req.params;
    console.log(req.params);
    let products = await Product.findAll({
      where: { distributor_id },
    });
    if (_.isEmpty(products)) {
      return res
        .status(404)
        .send("No products exist in the database with given distributor Id");
    }
    return res.status(200).json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};
