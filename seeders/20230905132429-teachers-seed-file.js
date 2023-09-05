'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const randomAppointment = ['[1, 2, 3]', '[1, 3, 5, 0]', '[2, 4, 6]', '[4, 5, 3]', '[6, 0]']
    await queryInterface.bulkInsert('Teachers',
      Array.from({ length: 50 }, () => ({
        name: faker.name.findName(),
        image: `https://loremflickr.com/150/150/happy,human/?random=${Math.random() * 100}`,
        introduction: faker.lorem.text(),
        teaching_style: faker.lorem.text(),
        during_time: Math.random() < 0.5 ? 30 : 30,
        url: faker.internet.url(),
        appointment: randomAppointment[Math.floor(Math.random() * randomAppointment.length)],
        user_id: users[Math.floor(Math.random() * users.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Teachers', {})
  }
}
