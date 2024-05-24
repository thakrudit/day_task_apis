const { where } = require("sequelize");
const helper = require("../config/helper");
const db = require("../models");

const User = db.users;
const Task = db.tasks;
const TaskMembers = db.task_members;

Task.hasMany(TaskMembers, { foreignKey: 'task_id' });
// Task.hasOne(TaskMembers, { foreignKey: "user_id" })

module.exports = {
    createTask: async (req, res) => {
        try {
            const required = {
                task_name: req.body.task_name,
                task_date: req.body.task_date,
                task_details: req.body.task_details,
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required)

            const user = await Task.create({
                task_name: requestedData.task_name,
                task_date: requestedData.task_date,
                task_details: requestedData.task_details,
            })
            return helper.success(res, "Task Created Successfully", user);
        }
        catch (err) {
            return helper.error(res, err)
        }
    },

    addTeamMembers: async (req, res) => {
        try {
            const required = {
                task_id: req.body.task_id,
                user_id: req.body.user_id
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required)

            const checkUser = await User.findOne({where: {id: requestedData.user_id}})
            if(!checkUser){
                return helper.error(res, "User not Exist")
            }

            const user = await TaskMembers.findOne({ where: { user_id: requestedData.user_id } })
            if (user) {
                return helper.error(res, "Member Already in this Task")
            }

            const data = await TaskMembers.create({
                task_id: requestedData.task_id,
                user_id: requestedData.user_id
            })
            return helper.success(res, "Member Created Successfully", data);


        } catch (err) {
            return helper.error(res, err)

        }
    },

    getHomePage: async (req, res) => {
        try {
            const required = {}
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required)

            const completedTasks = await Task.findAll({ where: { is_complete: 1 } })

            const tasks = await Task.findAll({ where: { is_complete: 0 } })
            const data = {
                CompletedTasks: completedTasks,
                OngoingTasks: tasks
            }
            return helper.success(res, "Getting Tasks on Home Page Successfully", data)

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

            const task = await Task.findOne({
                where: { id: requestedData.id },
                include: {
                    attributes: ["user_id"],
                    model: TaskMembers
                }
            })

            const tasks = await Task.findAll({ where: { is_complete: 0 } })

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