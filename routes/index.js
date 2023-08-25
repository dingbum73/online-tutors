const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const { generalErrorHandler } = require('../middleware/error-handler')

router.get('/signin', userController.signInPage)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/', (req, res) => res.render('index'))
router.use('/', generalErrorHandler)

module.exports = router
