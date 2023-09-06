const { User, Teacher, Record } = require('../models')
const { currentTaipeiTime } = require('../helpers/time-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { rankIndex } = require('../helpers/rank-helpers')
const { Op, Sequelize } = require('sequelize')

const searchController = {
  getLessons: async (req, res, next) => {
    try {
      const keyword = req.query.keyword
      const today = currentTaipeiTime()
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const [findTeachers, ranks] = await Promise.all([
        Teacher.findAndCountAll({
          where: {
            [Op.or]: [
              { name: { [Op.substring]: keyword } },
              { introduction: { [Op.substring]: keyword } }
            ]
          },
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
        introduction: r.introduction.substring(0, 50)
      }))
      const ranksIndex = rankIndex(ranks)

      console.log('teachers', teachers)
      console.log(' teachers.count', teachers.count)
      if (teachers.length) {
        return res.render('index', { teachers, ranksIndex, pagination: getPagination(limit, page, findTeachers.count), keyword })
      } else {
        return res.redirect('/')
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = searchController
