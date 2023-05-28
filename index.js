const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const app = express();
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");
const JWT_SECRET="qwertyuiopasdfghjklzxcvbnm1234567890(){}";


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
        min: 6,
        max: 12
  },
  confirmpassword: String,
});

const userModel = mongoose.model("user", userSchema);
//api signup

app.post("/signup", async (req, res) => {
  
  const { firstname, lastname, email, password, confirmpassword } = req.body;
  // const hashedPassword =await bcrypt.hashSync(password,10);
  //  const hashedconfirmpassword =await bcrypt.hash(confirmpassword,10);
  try{

    const oldUser = await userModel.findOne({email});
 
    if(oldUser){
      return res.json({error:"User Exists"});
    }
    await userModel.create({
          firstname,
          lastname,
          email,
          password,
          confirmpassword,
        });
        res.send({status:"ok"})
  }
  catch(error){
    res.send({status:"ok"})
  }
 
  // res.json({ message: "register the user" });
});

//api login
app.post("/login", async(req,res)=>{
  const {email, password} =req.body;

  const user= await userModel.findOne({email});
  if(!user){
    return res.json({error:"User not found"});
  }
  if(await bcrypt.compare(password, user.password)){
    const token =jwt.sign({},JWT_SECRET);

    if(res.status(201)){
      return res.json({status: "Ok",data:token});
    }
    else{
      return res.json({error:"error"});
    }
  }
  res.json({status:"error",error:"Invalid Password"});

});

app.listen(PORT, () => console.log("server is running at port: " + PORT));

// mongoose.set("strictQuery", false);
// mongoose
//   .connect(process.env.MONGODB_URL)
//   .then(() => console.log("connected to Database"))
//   .catch((err) => console.log(err));

//signUp
// app.post("/signup", async (req, res) => {
//   //console.log(req.body)
//   const { email } = req.body;
//   if(!firstName || !lastName || !email || !password || !confirmpassword){
//     res.status(400);
//     throw new Error("All feilds are mandotory");
//   }
//   //const userAvailable = await userModel.findOne({email});
//   if(userAvailable){
//     res.status(400);
//     throw new Error("User already registered");
//   }

//   //Hash password

//   const hashedPassword =await bcrypt.hash(password,10);
//   console.log("hashedPassword: " ,hashedPassword);
//   const user=await userModel.create({
//     firstName,
//     lastName,
//     email,
//     password:hashedPassword,
//   });
//   console.log(`User created  ${user}`);
//   if(user){
//     res.status(201).json({_id:user.id, email: user.email});
//   }
//   else{
//     res.status(400);
//     throw new Error("User data is not valid");
//   }

//userModel.findOne({ email: email }, (err, result) => {
//console.log(result)
// console.log(err);
// if (result) {
//   res.send({ message: "Email id is already register", alert: false });
// } else {
//   const data = userModel(req.body);
//   const save = data.save();
//   res.send({ message: "Successfully registered", alert: true });
// }
// });


// if (!firstname|| !lastname|| !email || !password || !confirmpassword) {
//   res.status(400);
//   throw new Error("All feilds are mandotory");
// }

// const userAvailable = await userModel.findOne({ email });
// if (userAvailable) {
//   res.status(400);
//   throw new Error("User already registered");
// }

// //hash password
// const hashedPassword =await bcrypt.hash(password,10);
// const hashedconfirmpassword =await bcrypt.hash(confirmpassword,10);
//   console.log("hashedPassword: " ,hashedPassword);
//   const user=await User.create({
//     firstname,
//     lastname,
//     email,
//     password:hashedPassword,
//     confirmpassword:hashedconfirmpassword,
//   });

//   console.log(`User created  ${user}`);
//     if(user){
//       res.status(201).json({_id:user.id, email: user.email});
//     }
//     else{
//       res.status(400);
//       throw new Error("User data is not valid");
//     }