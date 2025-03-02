const express = require('express');
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");

//sendConnectionRequest api 
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("sending conection request");
    res.send(user.firstName + "Connection request sent successfully");
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
});

module.exports = requestRouter;