const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');

require('dotenv').config();

module.exports = {
    getAllUsers: async (req, res) => {
        const users = await User.find();
        res.send(users);
    },
    postUserSingUp: async (req, res) => {
        try {
            req.body.email = req.body.email.toLowerCase();
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                throw new Error('This email is alredy taken! Try new one...')
            }
            if (req.body.confim_password === req.body.password) {
                req.body.password = bcrypt.hashSync(req.body.password)
                user = await User.create(req.body)
            } else { throw new Error('The password confirmation does not match. Please try again, but CORRECTLY (:') }
            res.send({
                err: false,
                message: 'A new user has been created!',
                user: user
            });
        } catch (error) {
            res.send({
                error: true,
                message: error.message
            });
        }
    },
    postUserSingIn: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                throw new Error("Invalid credential [Email]");
            }
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                throw new Error("Invalid credential [Password]");
            }

            const userToken = {
                id: user._id,
                email: user.email,
            }
            const token = jwt.sign(userToken, process.env.SECRET_AUTH_TOKEN, {
                expiresIn: '30m'
            })

            res.send({
                error: false,
                message: `User is logged in.`,
                token: token
            });
        } catch (error) {
            res.status(401).send({
                error:true,
                message: error.message
            });
            res.status(200).send({
                error:false,
                message: 'You are Logged in',
                token:token
            });
        }
    },
    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
            res.send({
                error: false,
                message: `Info for user ${user.first_name} with id #${user.id}`,
                user: user
            })
        } catch (error) {
            res.send({
                error: true,
                message: error.message
            })
        }
    },
    postUserEdit: async (req, res) => {
        try {
            if (req.body.confirm_password === req.body.password) {
                req.body.password = bcrypt.hashSync(req.body.password)
                const user = await User.findByIdAndUpdate(req.user.id, req.body)
                res.send({
                    error: false,
                    message: `Updated user ${user.first_name}`,
                    user: user
                });
            } else { throw new Error('The password confirmation does not match. Please try again, but CORRECTLY (:') }
        }
        catch (error) {
            res.send({
                error: true,
                message: error.message
            })
        }
    },
    getUserEdit: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            res.send({
                error: false,
                message: `User ${user.first_name}`,
                user: user
            })
        }
        catch (error) {
            res.send({
                error: true,
                message: error.message
            })
        }
    },
    deleteUser: async (req, res) => {
        try {
            const userToken = {
                id: req.user.id,
                email: req.user.email,
                first_name: req.user.first_name
            }
            const token = jwt.sign(userToken, process.env.SECRET_AUTH_TOKEN, { expiresIn: '1s' });
            const user = await User.findByIdAndDelete(req.user.id);
            res.send({
                error: false,
                message: "User has been deleted",
                token: token
            });
        }
        catch (error) {
            res.send({
                error: true,
                message: error.message
            })
        }
    },
    postUserSingOut: (req, res) => {
        try {
            const userToken = {
                id: req.user.id,
                email: req.user.email,
                first_name: req.user.first_name
            }

            const token = jwt.sign(userToken, process.env.SECRET_AUTH_TOKEN, { expiresIn: '1s' });
            res.send(token);

        } catch (error) {
            res.sned({
                error: true,
                message: error.message
            })
        }
    },
}
