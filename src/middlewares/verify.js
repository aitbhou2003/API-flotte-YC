const jwf = require('jsonwebtoken')
const verify = require('../utils/token')


exports.verifyToken = (req,res,next)=>{
    try {
        var token = req.headers.authorization
        // console.log(token)
        if (token=== undefined){
            return res.json("token not exist")
        }

        token = token.split(' ')[1]
        if (!token){
            return res.json('token not found')
        }
        const verifyToken = verify.verifyToken(token)
        req.user = verifyToken
        next()
    } catch (error) {
        console.log(error)
        res.json(error)
    }
}

exports.isChauffeur = (req,res,next)=>{
    try{
        console.log(req.user)
        const {role} = req.user
        if(role === "chauffeur"){
            next()
        }else {
            res.json({message:"not authorized user"})
        }
    }catch (e){
        console.log(e)
    }
}


exports.isAdmin = (req,res,next)=>{
    try{
        // console.log(req.user.userRole); 
        // const {role} = req.user.userRole

        // console.log(role);return;
        
        if(req.user.userRole==="admin"){
            next()
        }else {
            res.json({
                message : "not authorized user"
            })
        }
    }catch (e){
        console.log(e)
    }
}





