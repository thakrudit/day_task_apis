const express = require('express')
const router = express.Router()
const AuthController = require("../controller/userAuth")

router.post("/sign-up", AuthController.signUp)
router.post("/log-in", AuthController.logIn)

module.exports = router