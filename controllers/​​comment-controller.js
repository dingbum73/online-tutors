const { Record, Comment, Teacher } = require('../models')
const { Op } = require('sequelize')

const commentController = {
  getCommentScore: async (req, res, next) => {
    const { id } = req.user
    const { teacherId } = req.params
    try {
      const record = await Record.findAll({ where: { teacherId, userId: id, startDate: { [Op.lt]: new Date() } }, raw: true })
      if (record.length === 0) return res.json({ status: 'error', info: '未上過此課程', id: teacherId })
      const teacher = await Teacher.findOne({ where: { id: teacherId }, raw: true })
      return res.json(teacher)
    } catch (err) {
      next(err)
    }
  },
  postCommentScore: async (req, res, next) => {
    const { id } = req.user
    const { teacherId, scores, text } = req.body
    try {
      if (!scores || !text) return res.json({ status: 'error', info: '分數與評論都需填寫' })
      if (parseInt(scores) > 5 || parseInt(scores) < 1) return res.json({ status: 'error', info: '請填寫1~5分' })
      const record = await Record.findAll({ where: { teacherId, userId: id, startDate: { [Op.lt]: new Date() } }, raw: true })
      console.log('postCommentScore', record)
      if (record.length === 0) return res.json({ status: 'error', info: '未上過此課程' })
      const newComment = await Comment.create({
        scores,
        text,
        teacherId,
        userId: id
      })
      return res.json(newComment)
    } catch (err) {
      next(err)
    }
  }

}

module.exports = commentController
