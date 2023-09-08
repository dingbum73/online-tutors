const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.adminSignInPage)
router.post('/signin', passport.authenticate('localStrategyAdmin', { failureRedirect: '/signin', failureFlash: true }), adminController.adminSignIn)

router.get('', authenticatedAdmin, adminController.adminGetUsers)

module.exports = router
