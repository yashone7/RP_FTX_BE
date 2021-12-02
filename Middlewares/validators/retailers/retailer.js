const { check } = require("express-validator");

module.exports.createRetailerValidator = [
  check("name", "name of the distributor is required").not().isEmpty(),
  check("phone_number", "phone number is required").isMobilePhone("en-IN"),
  check("email", "please provide a valid email id").isEmail(),
  check("password", "please provide a password with minimum of 6 characters")
    .isLength({ min: 6 })
    .not()
    .isEmpty(),
  check("address", "please enter the address of your company").not().isEmpty(),
  check("pincode", "please enter a valid picode").isPostalCode("IN"),
  check("location.type", "please enter the type of geojson document")
    .not()
    .isEmpty(),
  check("location.geometry", "please provide a valid point in geojson document")
    .not()
    .isEmpty(),
  check(
    "location.geometry.coordinates",
    "please provide a proper lat long array"
  ).isArray({ min: 0, max: 2 }),
];
