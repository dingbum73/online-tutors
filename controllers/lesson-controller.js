const { User, Teacher, Record } = require('../models')
const { calculate, isBooking, isRepeat, isOpen } = require('../helpers/time-helpers')

const lessonController = {
  getLessons: async (req, res, next) => {
    try {
      const teachers = await Teacher.findAll({
        include: [{ model: User, as: 'isUser' }],
        raw: true,
        nest: true
      })
      return res.render('index', { teachers })
    } catch (err) {
      next(err)
    }
  },
  getLesson: async (req, res, next) => {
    try {
      const { id } = req.params
      const [teacher, findAppointment] = await Promise.all([
        Teacher.findByPk(id, {
          include: [{ model: User, as: 'isUser' }],
          raw: true,
          nest: true
        }),
        Record.findAll({ where: { teacherId: id }, raw: true }) || []
      ])
      const madeAppointment = findAppointment.map(a => a.startDate)
      if (typeof (teacher.appointment) !== 'object') {
        const newArray = []
        newArray.push(teacher.appointment)
        teacher.appointment = newArray
      }
      teacher.selection = calculate(teacher.appointment, madeAppointment, teacher.duringTime)

      return res.render('lessons/lesson', { teacher })
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
      console.log(teacher, findAppointment, findRecords)
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
