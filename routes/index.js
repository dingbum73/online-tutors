const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

router.get('/signin', userController.signInPage)
router.get('/signup', userController.signUpPage)
router.get('/', (req, res) => res.render('index'))

module.exports = router
