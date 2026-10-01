const jwt = require("jsonwebtoken");

require("dotenv").config;

const generateToken = (userId,userRole) => {
  const token = jwt.sign(
    {
      userId : userId,
      userRole : userRole
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

//   res.cookie("jwt", token, {
//     maxAge: 15 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//     sameSite: "strict",
//     secure: process.env.NODE_ENV !== "development",
//   });
};

const verifyToken = (token)=>{
    return jwt.verify(token, process.env.JWT_SECRET)
}


module.exports ={
    generateToken,
    verefyToken
}