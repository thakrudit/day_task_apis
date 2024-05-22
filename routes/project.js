const express = require('express')
const router = express.Router()
const ProjectController = require("../controller/project")
const requireAuthentication = require("../passport/index.js").authenticateUser

router.post('/create-task', requireAuthentication, ProjectController.createTask)
router.get('/get-home-page', requireAuthentication, ProjectController.getHomePage)
router.get('/get-task-detail', requireAuthentication, ProjectController.getTaskDetail)

module.exports = router