const express = require('express');
const port = 7777;
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');

app.use(express.json());
app.post('/signup', async (req, res) => {
const user = new User(req.body);
try {
  await user.save();
  res.send("User created successfully");
} catch (err) {
  console.error(err);
  res.status(500).send("An error occurred while creating the user");
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




