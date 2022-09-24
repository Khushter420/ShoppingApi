const express = require("express");

const userController = require("../controller/user");
const controller = require("../controller/product");

const authenticatemiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.post(
  "/upload",
  authenticatemiddleware.authenticate,
  controller.uploadData
);

router.post(
  "/createOrder",
  authenticatemiddleware.authenticate,
  controller.createOrder
);

router.post(
  "/updateOrder",
  authenticatemiddleware.authenticate,
  controller.updateOrder
);
router.post(
  "/orderedList",
  authenticatemiddleware.authenticate,
  controller.orderedList
);
router.post(
  "/productCountbyDate",
  authenticatemiddleware.authenticate,
  controller.productCountbyDate
);

router.post(
  "/customersList",
  authenticatemiddleware.authenticate,
  controller.customersList
);

module.exports = router;
