const router = require('express').Router()
const User = require('../controllers/user.controller')
const verify = require('../middlewares/verify')

router.post('/users',verify.verifyToken,verify.isAdmin,User.store)
router.post('/login',User.login)

router.patch('/users/:id/suspendre', verify.verifyToken, verify.isAdmin, User.suspendre);
router.patch('/users/:id/activer', verify.verifyToken, verify.isAdmin, User.activer);


module.exports = {
    router
}