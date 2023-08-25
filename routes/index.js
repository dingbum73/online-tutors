const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const lessonController = require('../controllers/lesson-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.get('/signin', userController.signInPage)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/logout', userController.logout)

router.get('/', authenticated, lessonController.getLessons)

router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/', (req, res) => res.redirect('index'))
router.use('/', generalErrorHandler)

module.exports = router
