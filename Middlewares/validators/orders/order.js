const { check } = require("express-validator");

module.exports.createOrderValidator = [
  check("order_amount", "Order amount is required").isNumeric(),
  check("client_id", "Client Id required and must be UUID").matches(
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  ),
  check(
    "distributor_id",
    "Distributor Id is required and must be UUID"
  ).matches(
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  ),
  check(
    "order_status",
    "order status is required and must be success/pending/failed"
  )
    .not()
    .isEmpty()
    .matches(/\b(?:success|pending|failed)\b/),
  check("order_date", "Order date is required and must be a date").isDate(),
];
