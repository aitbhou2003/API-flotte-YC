const jwt = require("jsonwebtoken");

require("dotenv").config;

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2d",
    },
  );

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

const verefyToken = (token)=>{
    const userId = jwt.verify(token,process.env.JWT_SECRET)
    return userId
}


module.exports ={
    generateTokenAndSetCookie,
    verefyToken
}