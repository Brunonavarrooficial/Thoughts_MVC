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

        //const thought = Thoughts.findOne({ where: { UserId: UserId } })
        res.render('thoughts/dashboard', { thoughts })
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
}


module.exports = ThoughtsController