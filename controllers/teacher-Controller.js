const { Teacher, Record, User, Comment } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { currentTaipeiTime } = require('../helpers/time-helpers')
const { Op, Sequelize } = require('sequelize')
const teacherController = {
  joinTeacher: (req, res) => {
    res.render('teachers/teacher-form')
  },
  postTeacher: async (req, res, next) => {
    const id = req.user.id
    const image = req.user.image
    const { name, introduction, teachingStyle, duringTime, url, appointment } = req.body
    try {
      if (!id) throw new Error('此用戶不存在')
      if (!name || !introduction || !teachingStyle || !duringTime || !url || !appointment) throw new Error('所有欄位都必填')
      if (parseInt(duringTime) !== 30 && parseInt(duringTime) !== 60) throw new Error('只能填寫30分或60分')
      const user = await Teacher.findOne({ where: { userId: id } })
      if (user) throw new Error('已經有老師身分了')
      await Teacher.create({
        name, introduction, teachingStyle, duringTime, url, appointment, image, userId: id
      })
      req.flash('success_messages', '申請老師成功！')
      return res.redirect('/')
    } catch (err) {
      next(err)
    }
  },
  getTeacher: async (req, res, next) => {
    const id = req.user.id

    try {
      const today = currentTaipeiTime()
      const teacher = await Teacher.findOne({
        where: { userId: id },
        include: [{ model: User, as: 'isUser' }],
        raw: true
      })
      if (!teacher) throw new Error('此用戶不存在')
      const teacherId = teacher.id
      const [findNewRecords, AllComment, avgComment] = await Promise.all([
        Record.findAll({
          where: {
            teacherId,
            startDate: { [Op.gte]: today }
          },
          include: [{ model: User }, { model: Teacher }],
          raw: true,
          nest: true
        }),
        Comment.findAll({
          where: { teacherId },
          order: [['scores', 'DESC']],
          raw: true
        }),
        Comment.findOne({
          where: { teacherId },
          attributes: [
            [Sequelize.fn('AVG', Sequelize.col('scores')), 'avgScores']
          ],
          raw: true
        })
      ])

      avgComment.avgScores = parseFloat(parseFloat(avgComment.avgScores).toFixed(1))
      const newRecords = findNewRecords.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
      const highComment = AllComment[0]
      const lowComment = AllComment[AllComment.length - 1]
      console.log('teachers/profile/AllComment', AllComment)
      res.render('teachers/profile', { teacher, newRecords, highComment, lowComment, avgComment })
    } catch (err) {
      next(err)
    }
  },
  editTeacher: async (req, res, next) => {
    const id = req.user.id
    try {
      const teacher = await Teacher.findOne({ where: { userId: id }, raw: true })
      if (!teacher) throw new Error('此用戶不存在')
      res.render('teachers/edit-profile', { teacher })
    } catch (err) {
      next(err)
    }
  },
  putTeacher: async (req, res, next) => {
    const id = req.user.id
    const { name, introduction, teachingStyle, duringTime, url, appointment } = req.body
    const { file } = req
    try {
      const teacher = await Teacher.findOne({ where: { userId: id } })
      if (!teacher) throw new Error('此用戶不存在')
      const filePath = await imgurFileHandler(file)
      await teacher.update({
        name: name || teacher.name,
        introduction: introduction || teacher.introduction,
        teachingStyle: teachingStyle || teacher.teachingStyle,
        duringTime: duringTime || teacher.duringTime,
        url: url || teacher.url,
        appointment,
        image: filePath || teacher.image
      })

      return res.redirect('/teachers/profile')
    } catch (err) {
      next(err)
    }
  }
}
module.exports = teacherController
