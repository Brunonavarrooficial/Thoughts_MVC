const Thoughts = require('../models/Thoughts')
const User = require('../models/User')

class ThoughtsController {
    static async showThoughts(req, res) {
        res.render('thoughts/home')
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