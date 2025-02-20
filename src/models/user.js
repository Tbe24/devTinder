const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      Min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if ((!["male", "female", "others"].includes(value))) {
          throw new Error("invalid gender type");
        }
      },
    },
    photoUrl:{
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F719872940202579%2F&psig=AOvVaw3",
    },
    about: {
      type: String,
      default: "this is default about the user.",
    },  
    skills: {
    type: [String],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('User', userSchema);