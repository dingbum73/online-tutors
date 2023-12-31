const bcrypt = require('bcryptjs')
const { User, Teacher, Record, Comment } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { currentTaipeiTime } = require('../helpers/time-helpers')
const { myRank } = require('../helpers/rank-helpers')
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
    req.logout(() => {
      req.flash('success_messages', '登出成功！')
      res.redirect('/signin')
    })
  },
  getUser: async (req, res, next) => {
    const id = req.user.id
    try {
      const today = currentTaipeiTime()
      const [user, findNewRecords, findComments, allRanks] = await Promise.all([
        User.findByPk(id, {
          include: [{ model: Teacher, as: 'isTeacher' }],
          raw: true,
          nest: true
        }),
        Record.findAll({
          where: {
            userId: id,
            startDate: { [Op.gte]: today }
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
        }),
        Record.findAll({
          where: {
            startDate: { [Op.lt]: today }
          },
          include: [{ model: User, attributes: ['name', 'image'] }],
          attributes: [
            'user_id',
            [Sequelize.fn('sum', Sequelize.col('during_time')), 'total']
          ],
          group: ['user_id'],
          order: [
            [Sequelize.fn('sum', Sequelize.col('during_time')), 'DESC']
          ],
          raw: true,
          nest: true
        })
      ])
      if (!user) throw new Error('此用戶不存在')
      const hasCommentIds = findComments.map(comment => comment.id) // 先找出userId所有已評論過的teacherId
      // 找出舊紀錄中不包含已評論過的老師
      const findOldRecordsWithout = await Record.findAll({
        where: {
          userId: id,
          startDate: { [Op.lt]: today },
          teacherId: {
            [Op.notIn]: hasCommentIds
          }
        },
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('teacher_id')), 'id']
        ],
        include: { model: Teacher, attributes: ['name', 'image'] },
        raw: true,
        nest: true
      })

      const newRecords = findNewRecords.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
      const myRankData = myRank(id, allRanks)
      user.isTeacher = user.isTeacher.id ? user.isTeacher : null
      user.strategy = 'localStrategylocal'
      return res.render('users/profile', { user, newRecords, findOldRecordsWithout, myRankData })
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
      user.strategy = 'localStrategylocal'
      return res.render('users/edit-profile', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    const id = req.user.id
    const { name, email, password, nation, introduction } = req.body
    const { file } = req
    try {
      const [user, checkedEmail] = await Promise.all([
        User.findByPk(id),
        User.findOne({
          where: {
            email,
            id: {
              [Op.ne]: id
            }
          }
        })
      ])
      const filePath = await imgurFileHandler(file)
      if (!user) throw new Error('此用戶不存在')
      if (checkedEmail) throw new Error('email已被使用')

      let hash
      if (password) {
        hash = await bcrypt.hash(password, 10)
      }

      await user.update({
        name: name || user.name,
        email: email || user.email,
        password: hash || user.password,
        nation: nation || user.nation,
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
