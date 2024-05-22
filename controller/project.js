const helper = require("../config/helper");
const db = require("../models");

const User = db.users
const Task = db.projects

User.hasOne(Task, { foreignkey: "project_team" })

module.exports = {
    createTask: async (req, res) => {
        try {
            const required = {
                user_id: req.user.id,
                project_name: req.body.project_name,
                project_date: req.body.project_date,
                // project_team: req.body.project_team,
                project_details: req.body.project_details,
                project_progress: req.body.project_progress
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required)

            const user = await Task.create({
                project_name: requestedData.project_name,
                project_date: requestedData.project_date,
                project_team: requestedData.user_id,
                project_details: requestedData.project_details,
                project_progress: requestedData.project_progress
            })
            return helper.success(res, "Project Created Successfully", user);
        }
        catch (err) {
            return helper.error(res, err)
        }
    },

    getHomePage: async (req, res) => {
        try {
            const required = {
                user_id: req.user.id
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required)

            const task = await Task.findAll()
            return helper.success(res, "Getting Projects on Home Page Successfully", task)

        } catch (err) {
            return helper.error(res, err)
        }
    },

    getTaskDetail: async (req, res) => {
        try {
            const required = {
                id: req.query.id
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required)

            const task = await Task.findOne({ where: { id: requestedData.id } })

            const tasks = await Task.findAll()

            const body = {
                task: task,
                tasks: tasks
            }

            return helper.success(res, "Getting Task Detail", body)



        } catch (err) {
            return helper.error(res, err)
        }
    }

}