const User = require("../models/user.model");
const { hashPass, comparePass } = require("../utils/password");
const { generateToken, verefyToken } = require("../utils/token");

exports.store = async (req, res) => {
  try {
    // console.log(req.body); return;
    const { firstName, lastName, email, password, role } = req.body;    

    const checkUser = await User.findOne({email : email})

    if(checkUser){
      return res.status(409).json({
        message : "user is exist"
      })
    }

    const encryptPass = await hashPass(password);
    
    const user = await User.create({
      firstName,
      lastName,
      email,
      password:encryptPass,
      role,
    })


    res.status(201).json({
      success :true,
      message : "user created with succes",

    })
  } catch (error) {

    return res.status(500).json({
      message : "internal server error"
    })
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.statue === "suspendu") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended",
      });
    }

    const matchPass = await comparePass(password, user.password);
    if (!matchPass) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",

      });
    }
    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      login: "login succesfully",
      token : token
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};


exports.suspendre = async (req, res) => {
  try {
    if (req.params.id === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "Vous ne pouvez pas suspendre votre propre compte",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    if (user.statue === "suspendu") {
      return res.status(400).json({
        success: false,
        message: "Ce compte est déjà suspendu",
      });
    }

    user.statue = "suspendu";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Compte suspendu avec succès",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        statue: user.statue,
      },
    });
  } catch (error) {
    console.error("suspendre error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.activer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    if (user.statue === "actif") {
      return res.status(400).json({
        success: false,
        message: "Ce compte est déjà actif",
      });
    }

    user.statue = "actif";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Compte réactivé avec succès",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        statue: user.statue,
      },
    });
  } catch (error) {
    console.error("activer error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
