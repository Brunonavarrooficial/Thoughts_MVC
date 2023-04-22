const express = require('express')
const router = express.Router()
const ThoughtsController = require('../controllers/ThoughtsController')

// helper
const checkAuth = require('../helpers/auth').checkAuth



router.get('/add', checkAuth, ThoughtsController.createThought)
router.post('/add', checkAuth, ThoughtsController.createThoughtSave)
router.get('/dashboard', checkAuth, ThoughtsController.dashboard)
router.get('/edit/:id', checkAuth, ThoughtsController.editThought)
router.post('/edit', checkAuth, ThoughtsController.editThoughtSave)
router.post('/remove', checkAuth, ThoughtsController.removeThought)
router.get('/', ThoughtsController.showThoughts)

module.exports = router