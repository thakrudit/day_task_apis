const db = require('../models');
var randomstring = require("randomstring");
const fetch = require('node-fetch-commonjs')
const crypto = require('crypto');
const User= db.students;

const KEY = process.env.ENCRYPTION || "";
const encryptionKey = process.env.ENCRYPTION || "";
const encryptionIV = process.env.ENCRYPTIONIV || "";


module.exports = {
    validateObject: async (required, non_required) => {
        let message = '';
        let empty = [];

        let model = required.hasOwnProperty('model') && db.hasOwnProperty(required.model) ? db[required.model] : User;

        for (let key in required) {
            if (required.hasOwnProperty(key)) {
                if (required[key] == undefined || required[key] === '' && (required[key] !== '0' || required[key] !== 0)) {
                    empty.push(key);
                }
            }
        }

        if (empty.length != 0) {
            message = empty.toString();
            if (empty.length > 1) { 
                message += " fields are required"
            } else {
                message += " field is required"
            }
            throw {
                'code': 400,
                'message': message
            }
        } else {
            if (required.hasOwnProperty('securitykey')) {
                if (required.securitykey != "ads") {
                    message = "Invalid security key";
                    throw {
                        'code': 400,
                        'message': message
                    }
                }
            }
            // if (required.hasOwnProperty('password')) {
            //     required.password = module.exports.createSHA1Hash(required.password);
            // }

            if (required.hasOwnProperty('checkExists') && required.checkExists == 1) {
                const checkData = {
                    email: 'Email already exists, kindly use another.',
                    phone: 'Phone number already exists, kindly use another'
                }

                for (let key in checkData) {
                    if (required.hasOwnProperty(key)) {
                        const checkExists = await model.findOne({
                            where: {
                                [key]: required[key].trim()
                            }
                        });
                        if (checkExists) {
                            throw {
                                code: 400,
                                message: checkData[key]
                            }
                        }
                    }
                }
            }

            const merge_object = Object.assign(required, non_required);
            delete merge_object.checkexit;
            delete merge_object.securitykey;

            if (merge_object.hasOwnProperty('password') && merge_object.password == '') {
                delete merge_object.password;
            }

            for (let data in merge_object) {
                if (merge_object[data] == undefined) {
                    delete merge_object[data];
                } else {
                    if (typeof merge_object[data] == 'string') {
                        merge_object[data] = merge_object[data].trim();
                    }
                }
            }

            return merge_object;
        }
    },

    unauth: function (res, err, body = {}) {
        console.log(err, '===========================>error');
        let code = (typeof err === 'object') ? (err.code) ? err.code : 401 : 401;
        let message = (typeof err === 'object') ? (err.message ? err.message : '') : err;
        res.status(code).json({
            'success': false,
            'code': code,
            'message': message,
            'body': body
        });

    },

    success: function (res, message = '', body = {}) {
        // const encryptedMessage = encryptAES(JSON.stringify(body), encryptionKey, encryptionIV);
        // const decryptedMessage = decryptAES(encryptedMessage, encryptionKey, encryptionIV);

        return res.status(200).json({
            'success': true,
            'code': 200,
            'message': message,
            'body': body
        });
    },

    error: function (res, err, body = {}) {
        console.log(err, '===========================>error');
        let code = (typeof err === 'object') ? (err.code) ? err.code : 200 : 400;
        let message = (typeof err === 'object') ? (err.message ? err.message : '') : err;
        res.status(200).json({
            'success': false,
            'code': code,
            'message': message,
            'body': body
        });
    },

    fileUpload: (file, parentFolder = '') => {
        let file_name_string = file.name;
        var file_name_array = file_name_string.split(".");
        var file_extension = file_name_array[file_name_array.length - 1];
        var result = "";
        result = Math.floor(Date.now() / 1000)
        let name = result + '.' + file_extension;
        file.mv(process.cwd() + `/./public/images/${name}`, function (err) {
            if (err) throw err;
        });
        return name;
    },

    multipleFileUpload: (files, parentFolder = '') => {
        let names = [];
        attachment = files;
        console.log(" attachment.length  ", attachment.length);
        if (attachment.length > 1) {
            attachment.forEach(file => {
                let file_name_string = file.name;
                var file_name_array = file_name_string.split(".");
                var file_extension = file_name_array[file_name_array.length - 1];
                var result = "";
                result = randomstring.generate(15);
                let name = result + '.' + file_extension;
                file.mv(process.cwd() + `/../public/images/${name}`, function (err) {
                    if (err) throw err;
                });
                names.push(name);
            });
        } else {
            let file_name_string = attachment.name;
            var file_name_array = file_name_string.split(".");
            var file_extension = file_name_array[file_name_array.length - 1];
            var result = "";
            result = randomstring.generate(15);
            let name = result + '.' + file_extension;
            attachment.mv(process.cwd() + `/../public/images/${name}`, function (err) {
                if (err) throw err;
            });
            names.push(name);
        }
        return names;
    },

    otpSend: async (email, name, msg, OTP) => {
        let url = 'https://api.brevo.com/v3/smtp/email';
        let options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'api-key': process.env.SEND_IN_BLUE_KEY
            },
            body: JSON.stringify({
                sender: { name: 'Cargopas', email: 'no-reply@techangouts.com' },
                to: [{ email: email }],
                replyTo: { email: 'no-reply@techangouts.com', name: 'No-Reply' },
                htmlContent: `
                <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                        <div style="border-bottom:1px solid #eee"><a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Cargopas</a></div>
                        <p style="font-size:1.1em">Hi, ${name} </p>
                        <p>Thank you for choosing Cargopas. ${msg}</p>
                        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                        <p style="font-size:0.9em;">Regards,<br />Cargopas</p>
                        <hr style="border:none;border-top:1px solid #eee" />
                        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        </div>
                    </div>
                </div>`,
                subject: "Otp for Cargopas"
            })
        }; //Use the following OTP to complete your Account recovery procedure
        return fetch(url, options)
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error('error:' + err));
    },

    emailSend: async (email, name, password, companyName) => {
        let url = 'https://api.brevo.com/v3/smtp/email';
        let options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'api-key': process.env.SEND_IN_BLUE_KEY
            },
            body: JSON.stringify({
                sender: { name: 'CARGOPAS', email: 'no-reply@techangouts.com' },
                to: [{ email: email }],
                replyTo: { email: 'no-reply@techangouts.com', name: 'No-Reply' },
                htmlContent: `
                <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
                    <div style="margin: 50px auto; width: 70%; padding: 20px 0">
                        <div style="border-bottom: 1px solid #eee">
                            <a href=" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600">CARGOPAS</a>
                        </div>
                        <p style="font-size: 1.1em">Hi, ${name}</p>
                        <p style="font-size: 1.1em"> ${companyName} has choose you as their driver</p>
                        <p style="font-size: 1.1em">Here is your email: ${email}</p>
                        <p style="font-size: 1.1em">Here is your password: ${password}</p>

                        <p></p>
                    </div>
                </div>`,
                subject: 'Welcome to Cargopas'
            })
        };
        return fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));
    }


}


function encryptAES(message, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'utf-8'), Buffer.from(iv, 'utf-8'));
    let encrypted = cipher.update(message, 'utf-8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

function decryptAES(encryptedMessage, key, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'utf-8'), Buffer.from(iv, 'utf-8'));
    let decrypted = decipher.update(encryptedMessage, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

