'use strict'
const { openLessonDay } = require('../helpers/time-helpers')
const dayjs = require('dayjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const teachers = await queryInterface.sequelize.query(
      'SELECT id,during_time,appointment,user_id FROM Teachers;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const records = []
    // 未來紀錄
    for (const t of teachers) {
      const lessonDay = openLessonDay(t.appointment, t.during_time)
      for (let i = 0; i <= 1; i++) {
        let userId
        do {
          userId = users[Math.floor(Math.random() * users.length)].id
        } while (userId === t.user_id)

        records.push({
          user_id: userId,
          teacher_id: t.id,
          start_date: lessonDay[i],
          during_time: t.during_time,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }
    // 舊紀錄：先找出不重複的User
    function getRandomUserExcluding (usedUsers) {
      let selectedUser
      do {
        selectedUser = users[Math.floor(Math.random() * users.length)]
      } while (usedUsers.includes(selectedUser.id))
      return selectedUser
    }

    for (const t of teachers) {
      const usedUsers = []
      for (let i = 0; i < 4; i++) {
        const user = getRandomUserExcluding(usedUsers)
        usedUsers.push(user.id)

        const lessonDay = openLessonDay(t.appointment, t.during_time)
        const randomNum = Math.floor(Math.random() * 15) + 30
        const pastDay = dayjs(lessonDay[i]).subtract(randomNum, 'day').format('YYYY-MM-DD HH:mm:ss')

        records.push({
          user_id: user.id,
          teacher_id: t.id,
          start_date: pastDay,
          during_time: t.during_time,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }

    await queryInterface.bulkInsert('Records', records)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Records', {})
  }
}
