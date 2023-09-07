const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const lessonController = require('../controllers/lesson-controller')
const teacherController = require('../controllers/teacher-Controller')
const commentController = require('../controllers/​​comment-controller')
const searchController = require('../controllers/search-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')
const upload = require('../middleware/multer')
const auth = require('./modules/auth')
const admin = require('./modules/admin')

router.use('/admin', authenticated, admin)
router.get('/signin', userController.signInPage)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.use('/auth', auth)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', upload.single('image'), authenticated, userController.putUser)

router.get('/teachers/join', authenticated, teacherController.joinTeacher)
router.get('/teachers/:id', authenticated, teacherController.getTeacher)
router.get('/teachers/:id/edit', authenticated, teacherController.editTeacher)
router.put('/teachers/:id', upload.single('image'), authenticated, teacherController.putTeacher)
router.post('/teachers/join', authenticated, teacherController.postTeacher)

router.get('/lessons/search', authenticated, searchController.getLessons)
router.get('/lessons/:id', authenticated, lessonController.getLesson)
router.get('/lessons', authenticated, lessonController.getLessons)

router.post('/api/records', authenticated, lessonController.postAppointment)
router.delete('/records/:id', authenticated, lessonController.delAppointment)

router.get('/comments/:teacherId', authenticated, commentController.getCommentScore)
router.post('/comments', authenticated, commentController.postCommentScore)

router.get('/', (req, res) => res.redirect('/lessons'))
router.use('/', generalErrorHandler)

module.exports = router
