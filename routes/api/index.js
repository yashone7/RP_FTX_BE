const express = require("express");
const router = express.Router();
//Imports For Distributor
const DistributorService = require("../../Services/Distributors/distService");
const {
  createDistributorValidator,
} = require("../../Middlewares/validators/distributors/checkCreateDistributor");

//For Product
const ProductService = require("../../Services/Products/productService");
const {
  createProductValidator,
} = require("../../Middlewares/validators/products/product");

//For Retailer
const RetailerService = require("../../Services/Retailers/retailerService");
const {
  createRetailerValidator,
} = require("../../Middlewares/validators/retailers/retailer");

//Imports For Favorites
const FavoriteService = require("../../Services/Favorites/favoriteService");
const {
  createFavoriteValidator,
} = require("../../Middlewares/validators/favorites/favorite");

router.post("/distributors", createDistributorValidator, (req, res, next) => {
  return DistributorService.createDistributor(req, res, next);
});
router.post("/products", createProductValidator, (req, res, next) => {
  return ProductService.createProduct(req, res, next);
});
router.get("/products", (req, res, next) => {
  return ProductService.getAllProducts(req, res, next);
});
router.get("/products/:product_id", (req, res, next) => {
  return ProductService.getProductById(req, res, next);
});

router.post("/retailers", createRetailerValidator, (req, res, next) => {
  return RetailerService.createRetailer(req, res, next);
});
router.get("/retailers/favorites", (req, res, next) => {
  return RetailerService.getRetailerDistributorFavs(req, res, next);
});
router.post("/favorites", createFavoriteValidator, (req, res, next) => {
  return FavoriteService.createFavorite(req, res, next);
});
router.delete("/favorites", createFavoriteValidator, (req, res, next) => {
  return FavoriteService.deleteFavorite(req, res, next);
});

module.exports = router;
