'use strict'
const faker = require('faker')
const { currentTaipeiTime } = require('../helpers/time-helpers')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const today = currentTaipeiTime()
    const records = await queryInterface.sequelize.query(
      'SELECT id,user_id,teacher_id FROM Records WHERE start_date < :todayDate',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        replacements: { todayDate: today }
      }
    )
    const teachers = await queryInterface.sequelize.query(
      'SELECT id FROM Teachers;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const comments = []
    for (const t of teachers) {
      const teacherRecords = records.filter(r => r.teacher_id === t.id)

      if (teacherRecords.length >= 2) {
        for (let i = 0; i < 2; i++) {
          const record = teacherRecords[i]
          comments.push({
            scores: Math.floor(Math.random() * 4) + 1,
            text: faker.lorem.text(),
            teacher_id: record.teacher_id,
            user_id: record.user_id,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      }
    }
    await queryInterface.bulkInsert('Comments', comments)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
