const helper = require("../config/helper");
const db = require("../models");

const User = db.users
const Task = db.tasks

// User.hasOne(Task, { foreignkey: "task_team" })

module.exports = {
    createTask: async (req, res) => {
        try {
            const required = {
                user_id: req.user.id,
                task_name: req.body.task_name,
                task_date: req.body.task_date,
                // task_team: req.body.task_team,
                task_details: req.body.task_details,
                task_progress: req.body.task_progress
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required)

            const user = await Task.create({
                task_name: requestedData.task_name,
                task_date: requestedData.task_date,
                task_team: requestedData.user_id,
                task_details: requestedData.task_details,
                task_progress: requestedData.task_progress
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