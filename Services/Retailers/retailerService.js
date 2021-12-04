const { validationResult } = require("express-validator");
const Retailer = require("../../Models/retailer");
const { QueryTypes, Sequelize } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../../config/connectDB");

module.exports.createRetailer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { name, phone_number, email, password, address, pincode, location } =
      req.body;

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
      address,
      location,
      pincode,
    });

    return res.status(200).send({ message: "retailer created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};

module.exports.getRetailerDistributorFavs = async (req, res, next) => {
  try {
    let { retailer_id } = req.query;
    const favDistributors = await sequelize.query(
      `SELECT 
      d.name as distributor_name,
      d.distributor_id, 
      r.retailer_id,
      r.name as retailer_name 
      FROM favorites f INNER JOIN retailers r ON r.retailer_id = f.retailer_id
      INNER JOIN distributors d ON d.distributor_id = f.distributor_id 
      WHERE r.retailer_id = "${retailer_id}"; `,
      { type: QueryTypes.SELECT }
    );
    if (_.isEmpty(favDistributors)) {
      return res.status(404).json({
        message: "sorry no favourite distributors for given retailer",
      });
    }
    return res.status(200).json(favDistributors);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error", error: err });
  }
};

module.exports.getAllRetailer = async (req, res, next) => {
  try {
    const retailer = await Retailer.findAll({
      attributes: ["retailer_id", "name", "email", "location"],
    });

    if (_.isEmpty(retailer)) {
      return res.status(404).send({ message: "no records found", retailer });
    }

    return res.status(200).json(retailer);
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};
