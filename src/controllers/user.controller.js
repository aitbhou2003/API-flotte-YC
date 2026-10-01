const User = require('../models/user.model')
const {hashPass , comparPass}= requir('../utils/password')
const {generateToken, verefyToken} = require('../utils/token')



exports.login = async (req,res)=>{
    try {
        const {user_email, user_password} = req.body;
        const user = await User.findOne({email : user_email})
        console.log(user);
        if (!user) {
            res.json("user not found")
        }
        const matchPass = await comparPass(user_password,user.password)
        if (!matchPass) {
            res.json("pasword not match")
        }
        const token = generateToken(user.id,user.role)

        res.header('token',token).json({
            succes : true,
            login : "login succesfully"
        })
        
    } catch (error) {
        console.log(error);
    }
}
