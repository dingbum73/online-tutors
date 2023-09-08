const { User, Teacher, Record, Comment } = require('../models')
const { calculate, isBooking, isRepeat, isOpen, currentTaipeiTime } = require('../helpers/time-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { rankIndex } = require('../helpers/rank-helpers')
const { Op, Sequelize } = require('sequelize')

const lessonController = {
  getLessons: async (req, res, next) => {
    try {
      const today = currentTaipeiTime()
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const [findTeachers, ranks] = await Promise.all([
        Teacher.findAndCountAll({
          include: [{ model: User, as: 'isUser' }],
          limit,
          offset,
          raw: true,
          nest: true
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
          limit: 10,
          raw: true,
          nest: true
        })
      ])
      const teachers = findTeachers.rows.map(r => ({
        ...r,
        introduction: r.introduction && r.introduction.length ? `${r.introduction.substring(0, 50)}...` : ''
      }))
      const ranksIndex = rankIndex(ranks)
      return res.render('index', { teachers, ranksIndex, pagination: getPagination(limit, page, findTeachers.count) })
    } catch (err) {
      next(err)
    }
  },
  getLesson: async (req, res, next) => {
    try {
      const { id } = req.params
      const [teacher, findAppointment, allComment, avgComment] = await Promise.all([
        Teacher.findByPk(id, {
          include: [{ model: User, as: 'isUser' }],
          raw: true,
          nest: true
        }),
        Record.findAll({ where: { teacherId: id }, raw: true }) || [],
        Comment.findAll({
          where: { teacherId: id },
          order: [['scores', 'DESC']],
          raw: true
        }),
        Comment.findOne({
          where: { teacherId: id },
          attributes: [
            [Sequelize.fn('AVG', Sequelize.col('scores')), 'avgScores']
          ],
          raw: true
        })
      ])
      const madeAppointment = findAppointment.map(a => a.startDate)
      if (typeof (teacher.appointment) !== 'object') {
        const newArray = []
        newArray.push(teacher.appointment)
        teacher.appointment = newArray
      }
      avgComment.avgScores = parseFloat(parseFloat(avgComment.avgScores).toFixed(1))
      teacher.selection = calculate(teacher.appointment, madeAppointment, teacher.duringTime)
      const highComment = allComment[0]
      const lowComment = allComment[allComment.length - 1]
      return res.render('lessons/lesson', { teacher, highComment, lowComment, avgComment })
    } catch (err) {
      next(err)
    }
  },
  postAppointment: async (req, res, next) => {
    const userId = req.user.id
    const { appointment, teacherId } = req.body
    const id = teacherId
    try {
      const [teacher, findAppointment, findRecords] = await Promise.all([
        Teacher.findByPk(id, { raw: true }),
        Record.findAll({ where: { teacherId: id }, raw: true }),
        Record.findAll({ where: { userId }, raw: true })
      ])
      // 驗證前端回傳資料
      if (!teacher) throw new Error('此用戶不存在')
      if (teacher.userId === userId) return res.json({ status: 'error', info: '無法預約自己的課' })
      if (!appointment) return res.json({ status: 'error', info: '請選擇時間' })
      if (typeof (teacher.appointment) !== 'object') {
        const newArray = []
        newArray.push(teacher.appointment)
        teacher.appointment = newArray
      }
      if (!isOpen(teacher.appointment, appointment)) return res.json({ status: 'error', info: '該時段未開放' })

      // 確認條件是否正確
      const madeAppointment = findAppointment.map(a => a.startDate)
      const checked = isBooking(appointment, madeAppointment) // 想要預約選課是否已被訂走
      const repeated = isRepeat(appointment, teacher.duringTime, findRecords) // 預約選課時間是否重疊了
      if (checked) return res.json({ status: 'error', info: '已被搶先選走了' })
      if (repeated) return res.json({ status: 'error', info: '該時段已有預約課' })
      // 創建新紀錄
      const newRecord = await Record.create({
        userId,
        teacherId: teacher.id,
        startDate: appointment,
        duringTime: teacher.duringTime
      })
      return res.json(newRecord)
    } catch (err) {
      next(err)
    }
  },
  delAppointment: async (req, res, next) => {
    const userId = req.user.id
    const { id } = req.params
    try {
      const record = await Record.findByPk(id)
      if (!record) throw new Error('無課程紀錄')
      await record.destroy()
      return res.redirect(`/users/${userId}`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = lessonController
