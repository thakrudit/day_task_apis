const db = require("../models");
const helper = require("../config/helper")
const bcrypt = require("bcryptjs")
const randomstring = require("randomstring")
const jwt = require("jsonwebtoken");

const { Op } = require('sequelize')

const User = db.users;

module.exports = {
    signUp: async (req, res) => {
        try {
            const required = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required);

            const existingUser = await User.findOne({ where: { email: requestedData.email } });
            if (!!existingUser) {
                return helper.error(res, "Email Already Exist...");
            }

            const salt = 10;
            const hashPassword = await bcrypt.hash(requestedData.password, salt);

            let otp = randomstring.generate({ length: 6, charset: 'numeric' });

            const user = await User.create({
                name: requestedData.name,
                profile_url: requestedData.profile_url,
                email: requestedData.email,
                password: hashPassword,
                otp: otp
            });

            const credentials = { id: user.id, email: user.email };
            const token = jwt.sign({ data: credentials }, process.env.JWT_SECRET);
            const body = {
                token: token,
                user: user,
            };
            return helper.success(res, "Signup Successfull...", body);
        } catch (err) {
            return helper.error(res, err)
        }
    },

    logIn: async (req, res) => {
        try {
            const required = {
                email: req.body.email,
                password: req.body.password
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required);

            const user = await User.findOne({ where: { email: requestedData.email } });
            if (!user) {
                return helper.error(res, "Login Email is Incorrect...");
            }

            const data = await bcrypt.compare(requestedData.password, user.password);
            if (!data) {
                return helper.error(res, "Login Password is Incorrect...");
            }
            let otp = randomstring.generate({ length: 6, charset: 'numeric' });

            if (user.is_verified === 0) {
                user.otp = otp
                user.save();
                // return helper.success(res, 'OTP Sent')
            }

            const credentials = { id: user.id, email: user.email };
            const token = jwt.sign({ data: credentials }, process.env.JWT_SECRET);

            const body = {
                token: token,
                user: user,
            };
            return helper.success(res, "Login Successfully...", body);

        } catch (err) {
            return helper.error(res, err)
        }
    },

    changePassword: async (req, res) => {
        try {
            const required = {
                user_id: req.user.id,
                old_password: req.body.old_password,
                new_password: req.body.new_password
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required);

            // const user_id = req.user.id;
            const user = await User.findOne({
                // attributes: ['id', 'email'],
                where: { id: requestedData.user_id },
            });

            if (!user) {
                return helper.error(res, "User not Found");
            }

            const hash = user.password;

            const comp_old_pass = await bcrypt.compare(requestedData.old_password, hash)

            if (!comp_old_pass) {

                return helper.error(res, "Old password does not mached");
            }

            const compNewPassword = await bcrypt.compare(requestedData.new_password, user.password)
            if (compNewPassword) {
                return res.json({ message: "New Password is same as Old Password" })
            }

            const salt = 10;
            const hashPassword = await bcrypt.hash(requestedData.new_password, salt);

            user.password = hashPassword
            user.save();
            return helper.success(res, "Password Changed Successfully", user)
        } catch (err) {
            return helper.error(res, err)
        }
    },

    getProfile: async (req, res) => {
        try {
            const required = {
                user_id: req.user.id
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required);

            // const user_id = req.user.id;
            // const user_id = req.query.user_id;

            const user = await User.findOne({
                // attributes: ['id', 'email'],
                where: { id: requestedData.user_id },
            });

            if (!user) {
                return helper.error(res, "User not Found");
            }

            return helper.success(res, "User Details Getting Successfully", user)
        } catch (err) {
            return helper.error(res, err)
        }
    },

    editProfile: async (req, res) => {
        try {
            const required = {
                user_id: req.user.id,
                new_name: req.body.new_name,
                new_email: req.body.new_email
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required);

            // const user_id = req.user.id;
            const user = await User.findOne({
                // attributes: ['id', 'email'],
                where: { id: requestedData.user_id },
            });

            if (!user) {
                return helper.error(res, "User not Found");
            }

            user.name = requestedData.new_name
            user.email = requestedDatanew_email
            user.save();

            return helper.success(res, "Profile Edited Successfully", user)
        } catch (err) {
            return helper.error(res, err)
        }
    },

    otpVerify: async (req, res) => {
        try {
            const required = {
                email: req.body.email,
                otp: req.body.otp
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required)

            const user = await User.findOne({ where: { email: requestedData.email } })
            if (!user) {
                return helper.error(res, "User not Found");
            }
            if (user.otp !== requestedData.otp) {
                return helper.error(res, "Incorrect OTP")
            }
            user.is_verified = 1
            user.save()
            return helper.success(res, "OTP verified successfully")
        } catch (err) {
            return helper.error(res, err)
        }
    },

    forgetPassword: async (req, res) => {
        try {
            const required = {
                email: req.body.email
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required)

            const user = await User.findOne({ where: { email: requestedData.email } })

            if (!user) {
                return helper.error(res, O = "User Not Found")
            }
            let otp = randomstring.generate({ length: 6, charset: 'numeric' });

            user.is_verified = 0
            user.otp = otp
            user.save()

            return helper.success(res, "Otp send Successfully")

        } catch (err) {
            return helper.error(res, err)
        }
    },

    resentOtp: async (req, res) => {
        try {
            const required = {
                email: req.body.email
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required)

            const user = await User.findOne({ where: { email: requestedData.email } })

            if (!user) {
                return helper.error(res, "User Not Found")
            }
            let otp = randomstring.generate({ length: 6, charset: 'numeric' });

            user.otp = otp
            user.save()
            return helper.success(res, "Resent Otp Successfully")


        } catch (err) {
            return helper.error(res, err)
        }
    },

    resetPassword: async (req, res) => {
        try {
            const required = {
                email: req.body.email,
                password: req.body.password
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required)

            const user = await User.findOne({ where: { email: requestedData.email } })

            if (!user) {
                return helper.error(res, "User Not Found")
            }

            const salt = 10
            const hashPassword = await bcrypt.hash(requestedData.password, salt)

            user.password = hashPassword
            user.save();
            return helper.success(res, "Reset Password Successfully")

        } catch (err) {
            return helper.error(res, err)
        }
    },

    search: async (req, res) => {
        try {
            const required = {
                name: req.body.name
            }
            const non_required = {}
            const requestedData = await helper.validateObject(required, non_required);

            const data = await User.findAll({ where: { name: { [Op.substring]: requestedData.name } } });

            return helper.success(res, 'Getting name Successfully', data)

        } catch (error) {
            return helper.error(res, error)
        }
    },

}