const jwf = require('jsonwebtoken')
const verify = require('../utils/token')


exports.verifyToken = (req,res,next)=>{
    try {
        var token = req.header.authorization
        console.log(token)
        if (token=== undefined){
            return res.json("token not exist")
        }

        token = token.split(' ')[1]
        if (!token){
            return res.json('token not found')
        }
        const verifyToken = verify.verefyToken(token)
        req.user = verifyToken
        next()
    } catch (error) {
        console.log(error)
        res.json(error)
    }
}

