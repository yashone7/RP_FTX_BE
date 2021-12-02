const { validationResult } = require("express-validator");
const Distributor = require("../../Models/distributors");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

module.exports.createDistributor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { name, phone_number, email, password, isDistributor } = req.body;

    let distributor = await Distributor.findOne({ where: { email } });

    if (!_.isEmpty(distributor)) {
      return res.status(400).send({
        message: "sorry distributor with the given email already exists",
      });
    }

    const distributor_id = uuidv4();

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    distributor = await Distributor.create({
      name,
      phone_number,
      email,
      password,
      isDistributor,
      distributor_id,
    });

    return res
      .status(200)
      .send({ message: "distributor created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};

module.exports.getAllDistributors = async (req, res, next) => {
  try {
    let distributors = await Distributor.findAll();
    if (_.isEmpty(distributors)) {
      return res.status(404).send("No distributors exist in the database");
    }
    return res.status(200).json(distributors);
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};
