const Product_Details = require("../models/Product_Details");
const users = require("../models/Users");
const OrderList = require("../models/OrderList");

// here i use async await basically diffrent method of writting the code

exports.uploadData = async (req, res) => {
  try {
    const { productCode, productName, quantity, brandName, prize } = req.body;
    let uploadData = await Product_Details.updateOne(
      { productCode: productCode },
      {
        $set: {
          productName: productName,
          quantity: quantity,
          brandName: brandName,
          prize: prize,
        },
      },
      { upsert: true }
    );

    return res.status(200).json({ uploadData, success: true });
  } catch (err) {
    console.log("uploadData error ", err);
    return res.status(403).json({ success: false, error: err });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { productDetails, mobile, Address } = req.body;
    //Basically productDetails is an array of object where diffrent product is added
    //   productDetails=[{
    //     "productCode":"KN01",
    //     "quantity":1
    //     "prize":"Rs1000"
    //   },{
    //     "productCode":"KN07",
    //     "quantity":4,
    //     "prize":"Rs1000"
    //   }]

    let productData = [];
    for (let i = 0; i < productDetails.length; i++) {
      let obj = {
        productCode: productDetails[i]["productCode"],
        quantity: productDetails[i]["quantity"],
        userMobile: mobile,
        prize: productDetails[i]["prize"],
        orderStatus: productDetails[i]["orderStatus"], //Active
      };
      productData.push(obj);
    }
    let orderData = await OrderList.insertMany(productData);
    // after productData added into OrderList Collection then we reduce the quantity of product
    if (orderData && orderData.length) {
      for (let i = 0; i < productDetails.length; i++) {
        let updateProduct = await Product_Details.updateOne(
          { productCode: productDetails[i]["productCode"] },
          { $inc: { quantity: -productDetails[i]["quantity"] } }
        );
      }
    }
    return res
      .status(200)
      .json({ message: "orderSuccefully placed", success: true });
  } catch (err) {
    return res.status(403).json({ success: false, error: err });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { productDetails, mobile } = req.body;
    for (let i = 0; i < productDetails.length; i++) {
      let updateOrder = await OrderList.updateMany(
        { userMobile: mobile, productCode: productDetails[i]["productCode"] },
        { $set: { orderStatus: productDetails[i]["orderStatus"] } }
      );
      if (productDetails[i]["orderStatus"] === "Cancelled") {
        let updateProduct = await Product_Details.updateOne(
          { productCode: productDetails[i]["productCode"] },
          { $inc: { quantity: 1 } }
        );
      }
    }
    return res
      .status(200)
      .json({ message: "succesfully updated", success: true });
  } catch (err) {
    return res.status(403).json({ success: false, error: err });
  }
};

exports.orderedList = async (req, res) => {
  try {
    const { mobile, sortText } = req.body;

    let orderedData = await OrderList.find({
      userMobile: mobile,
      orderStatus: "Active",
    }).sort({ sortText: -1 });
    return res.status(200).json({ orderedData, success: true });
  } catch (err) {
    return res.status(403).json({ success: false, error: err });
  }
};

exports.productCountbyDate = async (req, res) => {
  try {
    const { fromDate, todate } = req.body;
    fromDate = new Date(fromDate);
    todate = new Date(todate);
    let orderedData = await OrderList.aggregate([
      {
        $match: {
          _created_at: { $gte: fromDate },
          _created_at: { $lte: todate },
          orderStatus: "Active",
        },
      },
      { $group: { _id: "$productCode", count: { $sum: "$quantity" } } },
    ]);
    return res.status(200).json({ orderedData, success: true });
  } catch (err) {
    return res.status(403).json({ success: false, error: err });
  }
};

exports.customersList = async (req, res) => {
  try {
    let orderedData = await OrderList.aggregate([
      { $match: { orderStatus: "Active" } },
      {
        $group: {
          _id: "$userMobile",
          count: { $sum: 1 },
          quantity: { $sum: "$quantity" },
        },
      },
    ]);
    return res.status(200).json({ orderedData, success: true });
  } catch (err) {
    console.log(err, "errrr");
    return res.status(403).json({ success: false, error: err });
  }
};
