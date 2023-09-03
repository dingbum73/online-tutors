const bcrypt = require('bcryptjs')
const { User, Teacher, Record, Comment } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { Op, Sequelize } = require('sequelize')

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body
    try {
      if (!name || !email || !password || !confirmPassword) throw new Error('全部欄位都需填寫')
      if (name === password) throw new Error('名字密碼不可相同！')
      if (password !== confirmPassword) throw new Error('密碼輸入不同！')
      if (!email.includes('@')) throw new Error('email格式不正確')

      const user = await User.findOne({ where: { email } })

      if (user) throw new Error('此email已經註冊過了')

      const hash = await bcrypt.hash(password, 10)

      await User.create({
        name,
        email,
        password: hash
      })

      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout(() => {
      res.redirect('/signin')
    })
  },
  getUser: async (req, res, next) => {
    const id = req.user.id
    try {
      const [user, findNewRecords, findComments] = await Promise.all([
        User.findByPk(id, {
          include: [{ model: Teacher, as: 'isTeacher' }],
          raw: true,
          nest: true
        }),
        Record.findAll({
          where: {
            userId: id,
            startDate: { [Op.gte]: new Date() }
          },
          include: { model: Teacher },
          raw: true,
          nest: true
        }),
        Comment.findAll({
          where: {
            userId: id
          },
          attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('teacher_id')), 'id']
          ],
          raw: true
        })
      ])
      if (!user) throw new Error('此用戶不存在')
      const hasCommentIds = findComments.map(comment => comment.id) // 先找出userId所有已評論過的teacherId
      // 找出舊紀錄中不包含已評論過的老師
      const findOldRecords = await Record.findAll({
        where: {
          userId: id,
          startDate: { [Op.lt]: new Date() },
          teacherId: {
            [Op.notIn]: hasCommentIds
          }
        },
        include: { model: Teacher },
        raw: true,
        nest: true
      })
      const newRecords = findNewRecords.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
      const oldRecords = findOldRecords.map(r => ({ ...r.Teacher })) // 找出舊紀錄所有課程
      const uniqueRecords = oldRecords.filter((value, index, self) =>
        self.findIndex(t => t.id === value.id) === index
      )// 舊紀錄去重複
      user.isTeacher = user.isTeacher.id ? user.isTeacher : null
      return res.render('users/profile', { user, newRecords, uniqueRecords })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    const id = req.user.id
    try {
      const user = await User.findByPk(id, {
        include: [{ model: Teacher, as: 'isTeacher' }],
        raw: true,
        nest: true
      })
      if (!user) throw new Error('此用戶不存在')
      user.isTeacher = user.isTeacher.id ? user.isTeacher : null
      return res.render('users/edit-profile', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    const id = req.user.id
    const { name, nation, introduction } = req.body
    const { file } = req
    try {
      const user = await User.findByPk(id)
      const filePath = await imgurFileHandler(file)
      if (!user) throw new Error('此用戶不存在')
      await user.update({
        name: name || user.name,
        nation,
        introduction: introduction || user.introduction,
        image: filePath || user.image
      })
      return res.redirect('/users/profile')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
