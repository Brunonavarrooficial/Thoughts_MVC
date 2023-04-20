const Thoughts = require('../models/Thoughts')
const User = require('../models/User')

class ThoughtsController {
    static async showThoughts(req, res) {
        res.render('thoughts/home')
    }
}


module.exports = ThoughtsController