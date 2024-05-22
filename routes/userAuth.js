const express = require('express')
const router = express.Router()
const AuthController = require("../controller/userAuth")
const requireAuthentication = require("../passport/index.js").authenticateUser       

router.post("/sign-up", AuthController.signUp)
router.post("/log-in", AuthController.logIn)
router.post('/change-password',requireAuthentication, AuthController.changePassword)
router.get('/get-profile', requireAuthentication, AuthController.getProfile)
router.post('/edit-profile',requireAuthentication , AuthController.editProfile)
router.post('/otp-verify' , AuthController.otpVerify)
router.post('/forget-password' , AuthController.forgetPassword)
router.post('/resent-otp' , AuthController.resentOtp)
router.post('/reset-password' , AuthController.resetPassword)
router.get('/search' , AuthController.search)

module.exports = router