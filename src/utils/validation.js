const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("name is not provided");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password should be strong");
  }
};
const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "skills",
    "about",
    "photoUrl",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
