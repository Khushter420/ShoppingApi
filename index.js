const path = require("path");
const express = require("express");
const cors = require("cors");
const User = require("./models/Users");
const Expense = require("./models/expenses");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

const userRoutes = require("./routes/user");

// get config vars
dotenv.config();
app.use(cors());

//app.use(bodyParser.urlencoded());  ////this is for handling forms
app.use(express.json()); //this is for handling jsons

app.use("/user", userRoutes);

const PORT = process.env.PORT || 3000;
const MONGODB_URl = process.env.DB_URL;

mongoose
  .connect(MONGODB_URl, { useNewUrlParser: true, useUnifiedTopology: false })
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}.`);
    });
  })
  .catch((err) => console.log(err));
