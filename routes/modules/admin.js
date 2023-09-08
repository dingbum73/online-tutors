const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const searchController = require('../../controllers/search-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.adminSignInPage)
router.post('/signin', passport.authenticate('localStrategyAdmin', { failureRedirect: '/signin', failureFlash: true }), adminController.adminSignIn)
router.get('/search', authenticatedAdmin, searchController.adminGetUsers)

router.get('', authenticatedAdmin, adminController.adminGetUsers)

module.exports = router
