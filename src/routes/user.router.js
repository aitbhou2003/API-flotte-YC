const router = require('express').Router()
const User = require('../controllers/user.controller')
const verify = require('../middlewares/verify')

router.post('/users',verify.verifyToken,verify.isAdmin,User.store)
router.post('/login',User.login)


module.exports = {
    router
}