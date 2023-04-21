const User = require('../models/User')

const bcrypt = require('bcryptjs')

class AuthController {

    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {

        const { email, password } = req.body

        const user = await User.findOne({ where: { email: email } })

        if (!user) {
            req.flash('message', 'usuário não encontrado!')
            res.render('auth/login')
            return
        }

        const passwordMatch = bcrypt.compareSync(password, user.password)

        if (!passwordMatch) {
            req.flash('message', 'Senha inválida!')
            res.render('auth/login')
            return

        }

        req.session.userid = user.id

        console.log('Dados de Login user: ', user.name)
        console.log('Id: ', req.session.userid)

        //req.session.userid = user.id

        req.flash('message', 'Login realizado com sucesso!')

        req.session.save(() => {
            //res.setHeader("Content-Type", "application/json");
            res.redirect('/')
        })
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

        const checkIfUserExists = await User.findOne({ where: { email: email } })

        if (checkIfUserExists) {
            req.flash('message', 'O e-mail já está em uso!')
            res.render('auth/register')

        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        User.create(user)
            .then((user) => {
                // initialize session
                req.session.userid = user.id

                console.log('criado e salvo os dados de user: ', user.name)
                console.log('Id: ', req.session.userid)

                //req.session.userid = user.id

                req.flash('message', 'Cadastro realizado com sucesso!')

                req.session.save(() => {
                    //res.setHeader("Content-Type", "application/json");
                    res.redirect('/')
                })
            })
            .catch((err) => console.log(err))

        // try {
        //     //await User.create(user)
        //     const createdUser = await User.create(user)

        //     //req.session.userid = user.id
        //     req.session.userid = createdUser.id

        //     req.flash('message', `Cadastro do User: ${createdUser.name} realizado com sucesso!`)

        //     req.session.save(() => {
        //         res.redirect('/')
        //     })

        // } catch (error) {
        //     console.log('erro ao criar usuário: ', error)
        // }
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}

module.exports = AuthController