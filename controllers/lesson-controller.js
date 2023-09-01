const { User, Teacher, Record } = require('../models')
const { calculate } = require('../helpers/time-helpers')

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
      teacher.selection = calculate(teacher.appointment, madeAppointment, teacher.duringTime)

      return res.render('lessons/lesson', { teacher })
    } catch (err) {
      next(err)
    }
  },
  postAppointment: async (req, res, next) => {
    const id = req.params.id
    const userId = req.user.id
    const { appointment } = req.body
    try {
      const teacher = await Teacher.findByPk(id, { raw: true })
      if (!teacher) throw new Error('此用戶不存在')

      if (teacher.userId === userId) return res.json({ info: '無法預約自己的課' })
      if (!appointment) return res.json({ info: '請選擇時間' })

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
  }
}

module.exports = lessonController
