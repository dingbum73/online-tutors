const passport = require('passport')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcryptjs')
const { User, Teacher, Admin } = require('../models')
const { Model } = require('sequelize')

passport.use('localStrategylocal', new LocalStrategy({
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

passport.use('localStrategyAdmin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, cb) => {
  try {
    const user = await Admin.findOne({ where: { email } })
    if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
    return cb(null, user)
  } catch (err) {
    return cb(err)
  }
}))

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const { email, name } = profile._json
    const user = await User.findOne({ where: { email } })
    if (user) return cb(null, user)

    const randomPassword = Math.random().toString(36).slice(-8)
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(randomPassword, salt)
    const newUser = await User.create({ name, email, password: hash })
    return cb(null, newUser)
  } catch (err) {
    return cb(err)
  }
}
))

passport.serializeUser((user, cb) => { cb(null, user.email) })
passport.deserializeUser(async (email, cb) => {
  try {
    let user = await User.findOne({
      where: { email },
      include: [{ model: Teacher, as: 'isTeacher' }]
    })
    if (user) {
      user = user.toJSON()
      user.strategy = 'localStrategylocal'
      return cb(null, user)
    }

    let admin = await Admin.findOne({ where: { email } })
    if (admin) {
      admin = admin.toJSON()
      admin.strategy = 'localStrategyAdmin'
      return cb(null, admin)
    }

    cb(new Error('User not found'))
  } catch (err) {
    cb(err, null)
  }
})
// passport.deserializeUser(async (id, cb) => {
//   try {
//     const user = await User.findByPk(id, {
//       include: [
//         { model: Teacher, as: 'isTeacher' }
//       ]
//     })
//     cb(null, user.toJSON())
//   } catch (err) {
//     cb(err, null)
//   }
// })

module.exports = passport
