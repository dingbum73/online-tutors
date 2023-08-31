const { User, Teacher } = require('../models')
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
    const id = req.params.id
    try {
      const teacher = await Teacher.findByPk(id, {
        include: [{ model: User, as: 'isUser' }],
        raw: true,
        nest: true
      })
      const selection = calculate(teacher.appointment, [], teacher.duringTime)
      teacher.selection = selection
      console.log(teacher.selection)
      return res.render('lessons/lesson', { teacher })
    } catch (err) {
      next(err)
    }
  },
  postAppointment: (req, res, next) => {

  }
}

module.exports = lessonController
