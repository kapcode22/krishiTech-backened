const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//random number 
const JWT_SECRET = "qwertyuiopasdfghjklzxcvbnm1234567890(){}";

//const connectDb =require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
app.use(cors());
app.use(express.json());
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

// mongodb connection
connectDb();

//schema
const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 3,
    max: 12,
  },
  confirmPassword: String,
});

const userModel = mongoose.model("user", userSchema);
//api signup

app.post("/signup", async (req, res) => {
  const { firstname, lastname, email, password, confirmPassword } = req.body;
  // const hashedPassword =await bcrypt.hashSync(password,10);
  //  const hashedconfirmPassword =await bcrypt.hash(confirmPassword,10);
  try {
    const oldUser = await userModel.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await userModel.create({
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }

  // res.json({ message: "register the user" });
});

//api login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.json({ error: "User not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({}, JWT_SECRET);

    if (res.status(201)) {
      return res.json({ status: "Ok"});
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "Invalid Password" });
});

app.listen(PORT, () => console.log("server is running at port: " + PORT));


