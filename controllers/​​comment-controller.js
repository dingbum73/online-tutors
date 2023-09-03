const { User, Record, Comment, Teacher } = require('../models')

const commentController = {
  getCommentScore: async (req, res, next) => {
    const { id } = req.user
    const { teacherId } = req.params
    console.log(' teacherId', teacherId)
    try {
      const record = await Record.findAll({ where: { teacherId, userId: id }, raw: true })
      console.log(record)
      if (!record) res.json({ status: 'error', info: '未上過此課程' })
      const teacher = await Teacher.findOne({ where: { id: teacherId }, raw: true })
      return res.json(teacher)
    } catch (err) {
      next(err)
    }
  },
  postCommentScore: async (req, res, next) => {
    const { id } = req.user
    const { recordIdOnModal, scores, comment } = req.body
    try {
      console.log('req.user', id)
      console.log('req.body', req.body)

      const record = await Record.findByPk(recordIdOnModal, { raw: true })
      if (id !== record.userId) return res.json({ status: 'error', info: '未上過此課程' })
      console.log('record', record)

      const newComment = await Comment.create({
        scores: parseInt(scores),
        text: comment,
        recordId: record.id,
        teacherId: record.teacherId,
        userId: id
      })
      console.log('newComment', newComment)
      return res.json(newComment)
    } catch (err) {
      next(err)
    }
  }

}

module.exports = commentController
