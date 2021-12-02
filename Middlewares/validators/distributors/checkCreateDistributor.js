const { check } = require("express-validator");

module.exports.createDistributorValidator = [
  check("name", "name of the distributor is required").not().isEmpty(),
  check("phone_number", "phone number is required").isMobilePhone("en-IN"),
  check("email", "please provide a valid email id").isEmail(),
  check("password", "please provide a password with minimum of 6 characters")
    .isLength({ min: 6 })
    .not()
    .isEmpty(),
];
