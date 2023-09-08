const { User } = require('../models')

const adminController = {
  adminSignInPage: (req, res) => {
    res.render('admin/admin-signin')
  },
  adminSignIn: (req, res, next) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin')
  },

  adminGetUsers: (req, res) => {
    res.render('admin/index')
  }
}

module.exports = adminController
