const User = require("../models/user.model");
const { hashPass, comparePass } = require("../utils/password");
const { generateToken, verefyToken } = require("../utils/token");

exports.store = async (req, res) => {
  try {
    // console.log(req.body); return;
    const { firstName, lastName, email, password, role } = req.body;    
    

    const encryptPass = await hashPass(password);
    
    const user = await User.create({
      firstName,
      lastName,
      email,
      password:encryptPass,
      role,
    })

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success :true,
      message : "user created with succes",
      token : token
    })
  } catch (error) {
    console.log("store user error : "+error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email);
    const user = await User.findOne({ email: email });
    console.log(user._id);
    if (!user) {
      res.status(404).json("user not found");
    }
    const matchPass = await comparePass(password, user.password);
    if (!matchPass) {
      res.status(404).json("pasword not match");
    }
    const token = generateToken(user._id, user.role);

    res.status(201).header("token", token).json({
      success: true,
      login: "login succesfully",
      token : token
    });
  } catch (error) {
    console.log(error);
  }
};
