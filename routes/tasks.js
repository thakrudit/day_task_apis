const express = require('express')
const router = express.Router()
const ProjectController = require("../controller/tasks.js")
const requireAuthentication = require("../passport/index.js").authenticateUser

router.post('/create-task', requireAuthentication, ProjectController.createTask)
router.post('/add-team-members', requireAuthentication, ProjectController.addTeamMembers)
router.get('/get-home-page', requireAuthentication, ProjectController.getHomePage)
router.get('/get-task-detail', requireAuthentication, ProjectController.getTaskDetail)

module.exports = router