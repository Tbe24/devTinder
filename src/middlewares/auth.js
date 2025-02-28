const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
try {
    const { token } = req.cookies;
    if (!token) {
        throw new Error("No token provided");
    }
    //verify the token
    const decodedMessage = jwt.verify(token, "devTinder@123");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
        throw new Error("User not found");
    }
    req.user = user;
    next();
} catch (error) {
    res.status(400).send("ERROR :" + error.message);
}
};
module.exports = userAuth;