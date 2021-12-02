const { check } = require("express-validator");

module.exports.createProductValidator = [
  check("product_name", "name of the Product is required").not().isEmpty(),
  check(
    "product_price",
    "Product price is required and must be numeric"
  ).isNumeric(),
  check(
    "number_in_stock",
    "Number in stock is required and must be numeric"
  ).isNumeric(),
  check("distributor_id", "distributor id of the Product is required")
    .not()
    .isEmpty(),
];
