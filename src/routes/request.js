const express = require('express');
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require('../models/connectionReaquest');
const User = require('../models/user');

//sendConnectionRequest api 
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
   const fromUserId = req.user._id;
   const toUserId = req.params.toUserId;
   const status = req.params.status;

   const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({message:"Invalid status type: " + status});
    }

   const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({message:"User not found"});
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    })
    if (existingConnectionRequest) {
      return res.status(400).json({message:"Connection request already exists"});
    }

   const connectionRequest = new ConnectionRequest({
    fromUserId,toUserId,status
   })

   const data = await connectionRequest.save();
   res.json({
    message: req.user.firstName + " is " +status+ " in "+ toUser.firstName,
    data
   })

  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
});

module.exports = requestRouter;