const { check } = require("express-validator");

module.exports.createItemValidator = [
  check("product_id", "Product Id is invalid UUID").matches(
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  ),
  check(
    "product_price",
    "Product price is required and must be numeric"
  ).isNumeric(),
  check(
    "product_quantity",
    "product quantity is required and must be numeric"
  ).isNumeric(),
  check(
    "order_id",
    "Order id of the item is required and should be valid UUID"
  ).matches(
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  ),
];
