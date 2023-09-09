'use strict'
const { openLessonDay, timeTools } = require('../helpers/time-helpers')
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

    function getRandomUserExcluding (usedUsers, userId) {
      let selectedUser
      do {
        selectedUser = users[Math.floor(Math.random() * users.length)]
      } while (usedUsers.includes(selectedUser.id) || selectedUser.id === userId)
      return selectedUser
    }

    // 未來紀錄
    for (const t of teachers) {
      const usedUsers = []
      usedUsers.push(t.user_id)
      for (let i = 0; i < 3; i++) {
        const user = getRandomUserExcluding(usedUsers, t.user_id)
        usedUsers.push(user.id)
        const lessonDay = openLessonDay(t.appointment, t.during_time)
        const chooseLessonDay = timeTools(lessonDay[i + 1], t.during_time)
        records.push({
          user_id: user.id,
          teacher_id: t.id,
          start_date: chooseLessonDay.startTime,
          end_date: chooseLessonDay.endTime,
          during_time: t.during_time,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }
    // 舊紀錄
    let count = 0
    for (const t of teachers) {
      count++
      const usedUsers = []
      usedUsers.push(t.user_id)
      for (let i = 0; i < 2; i++) {
        const user = getRandomUserExcluding(usedUsers, t.user_id)
        usedUsers.push(user.id)

        const lessonDay = openLessonDay(t.appointment, t.during_time)
        const pastDay = dayjs(lessonDay[i]).subtract(7 + count, 'day').format('YYYY-MM-DD HH:mm:ss')
        const chooseLessonDay = timeTools(pastDay, t.during_time)
        records.push({
          user_id: user.id,
          teacher_id: t.id,
          start_date: chooseLessonDay.startTime,
          end_date: chooseLessonDay.endTime,
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
