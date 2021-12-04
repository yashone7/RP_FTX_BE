const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const Distributor = require("../../Models/distributors");
const Retailer = require("../../Models/retailer");
const { sequelize } = require("../../config/connectDB");

module.exports.distributorLogin = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    let distributor = await Distributor.findOne({ where: { email } });

    if (_.isEmpty(distributor)) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const validPassword = await bcrypt.compare(password, distributor.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const payload = {
      distributor_id: distributor.distributor_id,
      name: distributor.name,
      email: distributor.email,
      isDistributor: distributor.isDistributor,
      phone_number: distributor.phone_number,
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "3h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};

module.exports.retailerLogin = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    let retailer = await Retailer.findOne({ where: { email } });

    if (_.isEmpty(retailer)) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const validPassword = await bcrypt.compare(password, retailer.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const payload = {
      retailer_id: retailer.retailer_id,
      isDistributor: retailer.isDistributor,
      user: {
        phone_number: retailer.phone_number,
        name: retailer.name,
        email: retailer.email,
        isDistributor: retailer.isDistributor,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: "3h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};

module.exports.login = async (req, res, next) => {
  try {
    let { email, password, type } = req.body;

    console.log(type);

    if (_.trim(type) === "retailer") {
      let retailer = await Retailer.findOne({
        where: { email },
      });

      if (_.isEmpty(retailer)) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const validPassword = await bcrypt.compare(password, retailer.password);

      if (!validPassword) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const modifiedUser = {
        retailer_id: retailer.retailer_id,
        name: retailer.name,
        email: retailer.email,
        phone_number: retailer.phone_number,
        role: retailer.isDistributor ? "distributor" : "retailer",
      };

      const payload = {
        retailer_id: retailer.retailer_id,
        isDistributor: retailer.isDistributor,
        role: retailer.isDistributor ? "distributor" : "retailer",
        user: {
          retailer_id: retailer.retailer_id,
          name: retailer.name,
          email: retailer.email,
          phone_number: retailer.phone_number,
          isDistributor: retailer.isDistributor,
          role: retailer.isDistributor ? "distributor" : "retailer",
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "3h" },
        (err, token) => {
          if (err) throw err;
          return res.json({ token, user: modifiedUser });
        }
      );

      //   console.log("ran");
    } else if (_.trim(type) === "distributor") {
      let { email, password } = req.body;

      let distributor = await Distributor.findOne({
        where: { email },
      });

      if (_.isEmpty(distributor)) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const validPassword = await bcrypt.compare(
        password,
        distributor.password
      );

      if (!validPassword) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const modifiedUser = {
        distributor_id: distributor.distributor_id,
        name: distributor.name,
        email: distributor.email,
        phone_number: distributor.phone_number,
        role: distributor.isDistributor ? "distributor" : "retailer",
      };

      const payload = {
        distributor_id: distributor.distributor_id,
        isDistributor: distributor.isDistributor,
        role: distributor.isDistributor ? "distributor" : "retailer",
        user: {
          distributor_id: distributor.distributor_id,
          name: distributor.name,
          email: distributor.email,
          phone_number: distributor.phone_number,
          isDistributor: distributor.isDistributor,
          role: distributor.isDistributor ? "distributor" : "retailer",
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "3h" },
        (err, token) => {
          if (err) throw err;
          return res.json({ token, user: modifiedUser });
        }
      );

      //   console.log("ran-2");
    } else {
      return res.status(400).send("please give a proper type");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};

module.exports.loadUser = async (req, res, next) => {
  try {
    const { type, token } = req.query;
    const jwtSecret = config.get("jwtSecret");

    jwt.verify(
      token,
      jwtSecret,
      { algorithms: ["HS256"] },
      (err, decodedToken) => {
        if (err) {
          return res.status(401).send({
            message: "The token that is provided is invalid or expired",
          });
        }
        return res
          .status(200)
          .send({ payload: decodedToken, message: "token verified" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};

module.exports.verifyToken = (req, res, next) => {
  try {
    const { token } = req.query;
    const jwtSecret = config.get("jwtSecret");
    jwt.verify(
      token,
      jwtSecret,
      { algorithms: ["HS256"] },
      (err, decodedToken) => {
        if (err) {
          return res.status(401).send({
            message: "The token that is provided is invalid or expired",
          });
        }
        return res
          .status(200)
          .send({ payload: decodedToken, message: "token verified" });
      }
    );
  } catch (err) {
    return res.status(500).send({ message: "server error" });
  }
};
