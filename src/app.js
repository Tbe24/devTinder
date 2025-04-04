const express = require('express');
const app = express();
const port = 7777;
const connectDB = require('./config/database');
const User = require('./models/user');
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require('./routes/user');

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


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




