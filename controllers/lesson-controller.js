const { User, Teacher } = require('../models')

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
      return res.render('lessons/lesson', { teacher })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = lessonController
