const { validationResult } = require("express-validator");
const Retailer = require("../../Models/retailer");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

module.exports.createRetailer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { name, phone_number, email, password } = req.body;

    let retailer = await Retailer.findOne({ where: { email } });

    if (!_.isEmpty(retailer)) {
      return res.status(400).send({
        message: "sorry retailer with the given email already exists",
      });
    }

    const retailer_id = uuidv4();

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    retailer = await Retailer.create({
      name,
      phone_number,
      email,
      password,
      retailer_id,
    });

    return res.status(200).send({ message: "retailer created successfully" });
  } catch (error) {
    console.log(err);
    return res.status(500).send("server error");
  }
};
