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

//Imports for orders
const OrderService = require("../../Services/Orders/orderService");
const {
  createOrderValidator,
} = require("../../Middlewares/validators/orders/order");

//Imports for orders
const ItemService = require("../../Services/items/itemService");
const {
  createItemValidator,
} = require("../../Middlewares/validators/items/items");

const AuthService = require("../../Services/Auth/authService");
const { verifyToken } = require("../../Middlewares/Auth/verifyToken");
const RazorpayService = require("../../Services/Razorpay/razorpayService");

router.post("/distributors", createDistributorValidator, (req, res, next) => {
  return DistributorService.createDistributor(req, res, next);
});
router.get("/distributors", createDistributorValidator, (req, res, next) => {
  return DistributorService.getAllDistributors(req, res, next);
});

router.get("/distributors/search", (req, res, next) => {
  return DistributorService.searchDistributorByName(req, res, next);
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
router.get("/productsByDistributor/:distributor_id", (req, res, next) => {
  return ProductService.getProductsByDistributorId(req, res, next);
});

router.get("/retailers", (req, res, next) => {
  return RetailerService.getAllRetailer(req, res, next);
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

router.post(
  "/orders",
  /*createOrderValidator, */ (req, res, next) => {
    return OrderService.createOrder(req, res, next);
  }
);
router.get(
  "/orders/:client_id/:distributor_id",
  createOrderValidator,
  (req, res, next) => {
    return OrderService.getAllOrdersByRetailer(req, res, next);
  }
);
router.get(
  "/orders/:distributor_id",
  createOrderValidator,
  (req, res, next) => {
    return OrderService.getAllOrdersByDistributorId(req, res, next);
  }
);
router.get("/order/:order_id", createOrderValidator, (req, res, next) => {
  return OrderService.getOrderById(req, res, next);
});

router.patch(
  "/orders/update",
  /* createOrderValidator, */ (req, res, next) => {
    return OrderService.updateOrderById(req, res, next);
  }
);

router.post("/items", createItemValidator, (req, res, next) => {
  return ItemService.createItem(req, res, next);
});

router.post("/distributors/auth", (req, res, next) => {
  return AuthService.distributorLogin(req, res, next);
});

router.post("/retailers/auth", (req, res, next) => {
  return AuthService.retailerLogin(req, res, next);
});

router.get("/auth/verify", (req, res, next) => {
  return AuthService.verifyToken(req, res, next);
});

router.post("/auth", (req, res, next) => {
  return AuthService.login(req, res, next);
});

router.post("/razorpay", (req, res, next) => {
  return RazorpayService.createOrder(req, res, next);
});

router.get("/sale", (req, res, next) => {
  return OrderService.getTotalSale(req, res, next);
});

router.get("/sale/retailer/:retailer_id", (req, res, next) => {
  return OrderService.getSaleByRetailerId(req, res, next);
});

router.get("/sale/retailer", (req, res, next) => {
  return OrderService.getSaleByRetailerBetweenDates(req, res, next);
});

router.get("/sale/date/:start_date/:end_date", (req, res, next) => {
  return OrderService.getTotalSaleBetweendates(req, res, next);
});

module.exports = router;
