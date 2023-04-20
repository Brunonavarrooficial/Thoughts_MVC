const User = require('../models/User')

const bcrypt = require('bcryptjs')

class AuthController {

    static login(req, res) {
        res.render('auth/login')
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {

        const { name, email, password, confirmpassword } = req.body

        if (password !== confirmpassword) {
            req.flash('message', 'as senhas não conferem, tente novamente!')
            res.render('auth/register')

            return
        }

        res.render('auth/register')
    }
}

module.exports = AuthController