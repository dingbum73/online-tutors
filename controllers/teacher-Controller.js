const { Teacher } = require('../models')
const teacherController = {
  joinTeacher: (req, res) => {
    res.render('teachers/teacher-form')
  },
  postTeacher: async (req, res, next) => {
    const id = req.user.id
    const image = req.user.image
    const { name, introduction, teachingStyle, duringTime, url, appointment } = req.body
    if (!id) throw new Error('此用戶不存在')
    try {
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
      const teacher = await Teacher.findOne({ where: { userId: id }, raw: true })
      if (!teacher) throw new Error('此用戶不存在')
      console.log(teacher)
      res.render('teachers/profile', { teacher })
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
  }
}

module.exports = teacherController
