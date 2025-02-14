const mongoose = require ("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://tbe24:c8EJdWrrMjmbJ5WO@devtinder.6g0yd.mongodb.net/devTinder"
  ); 
};

module.exports = connectDB;

