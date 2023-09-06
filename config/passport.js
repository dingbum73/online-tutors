const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Teacher } = require('../models')
const { Model } = require('sequelize')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, cb) => {
  try {
    const user = await User.findOne({ where: { email } })
    if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
    return cb(null, user)
  } catch (err) {
    return cb(err)
  }
}))

passport.serializeUser((user, cb) => { cb(null, user.id) })
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        { model: Teacher, as: 'isTeacher' }
      ]
    })
    cb(null, user.toJSON())
  } catch (err) {
    cb(err, null)
  }
})

module.exports = passport
