const express= require("express");
const User = require("../models/user");
const authRouter= express.Router();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require('../utils/validation');


//signup api to create user
authRouter.post('/signup', async (req, res) => {
  try {
    //validate entered credentials
    validateSignUpData(req);

  const { firstName, lastName, emailId, password } = req.body;

    //encrypt password
    const Passwordhashed = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    emailId,
    password:Passwordhashed
  });
  await user.save();
  res.send("User created successfully");
} catch (err) {
  res.status(500).send("Error :" + err.message);
}
});

//login api to authenticate user
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({emailId:emailId})
    if (!user) {
      throw new Error("invalid credential");
    }
      const isPasswordValid = await user.validatePassword(password);
      if(isPasswordValid){
      const token = await user.getJWT();
      //add the token to cookie and send it to the client
      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });
        res.send("login succesfull")
      }else{
        throw new Error("invalid credential");
      }
      
  }catch (err) {
  res.status(500).send("Error :" + err.message);
}
});

//logout api to logout user
authRouter.post('/logout', async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now())
  });
    res.send("logout succesfull");
});


module.exports= authRouter;