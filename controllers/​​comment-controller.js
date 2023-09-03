const { User, Record, Comment } = require('../models')

const commentController = {
  getCommentScore: async (req, res, next) => {
    const { id } = req.user
    const { recordId } = req.body
    try {
      const record = await Record.findByPk(recordId, { raw: true })
      if (id !== record.userId) res.json({ status: 'error', info: '未上過此課程' })
      console.log(record)
      return res.json(record)
    } catch (err) {
      next(err)
      res.render(`users/${id}`)
    }
  }

}

module.exports = commentController
