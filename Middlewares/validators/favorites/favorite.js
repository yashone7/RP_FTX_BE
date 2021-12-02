const { check } = require("express-validator");

module.exports.createFavoriteValidator = [
  check("distributor_id", "Distributor Id is invalid UUID").matches(
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  ),
  check("retailer_id", "Retailer Id is invalid UUID").matches(
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  ),
];
