const { User, Teacher } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const adminController = {
  adminSignInPage: (req, res) => {
    res.render('admin/admin-signin')
  },
  adminSignIn: (req, res, next) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/admin')
  },

  adminGetUsers: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 10
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const findAllUsers = await User.findAndCountAll({
        include: { model: Teacher, as: 'isTeacher' },
        limit,
        offset,
        raw: true,
        nest: true
      })
      const users = findAllUsers.rows.map(user => ({
        ...user,
        introduction: user.introduction && user.introduction.length ? `${user.introduction.substring(0, 50)}....` : ''
      }))
      res.render('admin/index', { users, pagination: getPagination(limit, page, findAllUsers.count) })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
