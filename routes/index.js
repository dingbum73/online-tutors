const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user')
const { generalErrorHandler } = require('../middleware/error-handler')

router.get('/signin', userController.signInPage)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/', (req, res) => res.render('index'))
router.use('/', generalErrorHandler)

module.exports = router
