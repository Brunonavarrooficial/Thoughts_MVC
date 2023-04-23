const Thoughts = require('../models/Thoughts')
const User = require('../models/User')

const { Op } = require('sequelize')

class ThoughtsController {
    static async showThoughts(req, res) {

        let search = ''

        if (req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'

        if (req.query.order === 'old') {
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        const thoughtsAll = await Thoughts.findAll({
            include: User,
            where: {
                title: { [Op.like]: `%${search}%` }
            },
            order: [['createdAt', order]]
        })

        //const thoughts = thoughtsAll.map((result) => result.dataValues)
        const thoughts = thoughtsAll.map((result) => result.get({ plain: true }))

        let thoughtsQty = thoughts.length

        console.log('findAll pensamentos', thoughts)
        console.log('Search => ', search, 'quantidade de => ', thoughtsQty)

        if (thoughtsQty === 0) {
            thoughtsQty = false
        }

        res.render('thoughts/home', { thoughts, search, thoughtsQty })
    }

    static async dashboard(req, res) {

        const UserId = req.session.userid

        const user = await User.findOne({
            where: {
                id: UserId
            },
            include: Thoughts,
            plain: true,
        })

        if (!user) {
            res.redirect('/login')
        }

        const thoughts = user.Thoughts.map((result) => result.dataValues)

        console.log('pensamento teste => ', thoughts)

        let emptyThoughts = false

        if (thoughts.length === 0) {
            emptyThoughts = true
        }


        res.render('thoughts/dashboard', { thoughts, emptyThoughts })
    }

    static createThought(req, res) {
        res.render('thoughts/create')
    }

    static async createThoughtSave(req, res) {

        const thought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Thoughts.create(thought)

            req.flash('message', 'Pensamento criado com sucesso!')

            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (error) {
            console.log('Erro ao criar pensamento => ', error)
        }

    }

    static async editThought(req, res) {
        const id = req.params.id

        const thought = await Thoughts.findOne({ where: { id: id }, raw: true })

        res.render('thoughts/edit', { thought })
    }

    static async editThoughtSave(req, res) {

        const thought = {
            id: req.body.id,
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Thoughts.update(thought, { where: { id: thought.id, UserId: thought.UserId } })

            req.flash('message', 'Pensamento editado com sucesso!')

            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (error) {
            console.log('Erro ao editar pensamento => ', error)
        }

    }

    static async removeThought(req, res) {
        const id = req.body.id
        const UserId = req.session.userid

        try {
            await Thoughts.destroy({ where: { id: id, UserId: UserId } })

            req.flash('message', 'Pensamento removido com sucesso!')

            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (error) {
            console.log(`Erro ao excluir o thought => ${error}`)
        }
    }
}


module.exports = ThoughtsController