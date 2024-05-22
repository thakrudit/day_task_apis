const express = require('express')
const router = express.Router()
const ProjectController = require("../controller/userAuth")
const requireAuthentication = require("../passport/index.js").authenticateUser

module.exports = router