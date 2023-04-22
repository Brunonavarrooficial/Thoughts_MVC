function checkAuth(req, res, next) {
    const userId = req.session.userid

    if (!userId) {
        res.redirect('/login')
    }

    next()
}

function checkLogged(req, res, next) {
    const userId = req.session.userid

    if (userId) {
        res.redirect('/')
    }

    next()
}

module.exports = {
    checkAuth,
    checkLogged
}