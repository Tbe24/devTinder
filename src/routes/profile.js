const express = require('express'); 
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const { validateEditProfileData } = require('../utils/validation');
const bcrypt = require("bcrypt");

//get/view profile of user 
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
}); 

//edit profile of user
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
    if(!validateEditProfileData(req)){
        throw new Error("Invalid fields to update");
    }
    const loggedInUser = req.user;
    // console.log(loggedInUser);
    
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    // console.log(loggedInUser);
    await loggedInUser.save();
    res.json({ message: `${loggedInUser.firstName} Profile updated successfully`, data: loggedInUser });
} catch (error) {
    res.status(400).send("ERROR :" + error.message);
    
}
});
//update password of user
profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
    try {
    const loggedInUser = req.user;
    const { oldPassword, newPassword } = req.body;
    const isPasswordValid = await loggedInUser.validatePassword(oldPassword);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    loggedInUser.password = await bcrypt.hash(newPassword, 10);
    await loggedInUser.save();
    res.send("Password updated successfully");
} catch (error) {
    res.status(400).send("ERROR :" + error.message);
}
});


module.exports = profileRouter;