const db = require("../models");
const helper = require("../config/helper")
const bcrypt = require("bcryptjs")
const randomstring = require("randomstring")
const jwt = require("jsonwebtoken")

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
}