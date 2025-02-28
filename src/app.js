const express = require('express');
const port = 7777;
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userAuth = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());
//signup api to create user
app.post('/signup', async (req, res) => {
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
app.post('/login', async (req, res) => {
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
//get profile of user 
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
}); 
//sendConnectionRequest api 
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("sending conection request");
    res.send(user.firstName + "Connection request sent successfully");
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
});

//get user by emailId
app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId;
try {
  const users = await User.find({ emailId: userEmail });
  if (users.length === 0) {
    res.status(404).send("User not found");
  }else{
    res.send(users);
  }
}catch (err) {
  res.status(400).send("something went wrong")
}
});
//get all users
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong")
  }
});
//delete user by userId from database
app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  }catch (err) {
    res.status(400).send("something went wrong")
  }
});
//update user by userId using patch method
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId; // Extract user ID from the request body
  const data = req.body; // Payload containing fields to update

  try {
    // List of fields that can be updated
    const allowedUpdates = [
      "firstName",
      "lastName",
      "password",
      "age",
      "skills",
      "about",
      "photoUrl",
    ];

    // Check if all keys in data are allowed updates
    const isValidUpdate = Object.keys(data).every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) {
      throw new Error("Invalid updates");
    }
    if(data.skills.length>10){
      throw new Error("skills should not be more than 10");
    }
    // Find user by ID and update
    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
      new: true, // Return the updated document
    });

    // Handle case when user is not found
    if (!user) {
      return res.status(404).send("User not found");
    } 

    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
    console.log(err.message); // Log the error for debugging
  }
});

connectDB()
.then(() => {
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch((err) => console.error("MongoDB connection error:", err));




