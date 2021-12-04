const config = require("../../config/default.json");
const apiKey = config["apiKey"];
const apiSecret = config["apiSecret"];
const Razorpay = require("razorpay");
const Distributor = require("../../Models/distributors");
const Retailer = require("../../Models/retailer");
const _ = require("lodash");
const { sequelize } = require("../../config/connectDB");

module.exports.createOrder = async (req, res, next) => {
  try {
    var instance = new Razorpay({
      key_id: apiKey,
      key_secret: apiSecret,
    });
    const { amount, retailer_id, distributor_id } = req.body;

    let retailer = await Retailer.findOne({ where: { retailer_id } });

    console.log(retailer);
    if (_.isEmpty(retailer)) {
      return res.status(400).send({
        message: "retailer with the given id does not exist",
      });
      // retailer = {
      //   name: "surya",
      //   email: "surya@test.com",
      // };
    }

    let distributor = await Distributor.findOne({ where: { distributor_id } });

    console.log(distributor);

    if (_.isEmpty(distributor)) {
      return res.status(400).send({
        message: "distributor with the given id does not exist",
      });
      // distributor = {
      //   name: "kiran",
      // };
    }
    const order = await instance.orders.create({
      amount: amount,
      currency: "INR",
      receipt: "receipt#1",
    });

    const response = {
      key: apiKey,
      amount: amount,
      order_id: order.id,
      retailer_name: retailer.name,
      retailer_email: retailer.email,
      distributor_name: distributor.name,
      retailer_phone: retailer.phone_number,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
};
