'use strict'
const faker = require('faker')
const { currentTaipeiTime } = require('../helpers/time-helpers')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const today = currentTaipeiTime()
    const records = await queryInterface.sequelize.query(
      'SELECT MIN(id) as id, user_id, teacher_id FROM Records WHERE start_date < :todayDate GROUP BY user_id, teacher_id',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        replacements: { todayDate: today }
      }
    )
    const comments = []

    for (const record of records) {
      comments.push({
        scores: Math.floor(Math.random() * 4) + 1,
        text: faker.lorem.text(),
        teacher_id: record.teacher_id,
        user_id: record.user_id,
        created_at: new Date(),
        updated_at: new Date()
      })
    }
    await queryInterface.bulkInsert('Comments', comments)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
