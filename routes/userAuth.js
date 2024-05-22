const express = require('express')
const router = express.Router()
const AuthController = require("../controller/userAuth")
const requireAuthentication = require("../passport/index.js").authenticateUser       

router.post("/sign-up", AuthController.signUp)
router.post("/log-in", AuthController.logIn)

module.exports = router