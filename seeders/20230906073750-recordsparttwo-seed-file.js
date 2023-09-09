'use strict'
const { openLessonDay, timeTools } = require('../helpers/time-helpers')
const dayjs = require('dayjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const comments = await queryInterface.sequelize.query(
      'SELECT MIN(id) as id, user_id, teacher_id FROM Comments GROUP BY user_id, teacher_id',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const teachers = await queryInterface.sequelize.query(
      'SELECT id,during_time,appointment,user_id FROM Teachers;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users ;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const records = []

    function getRandomTeacherExcluding (usedTeachers, userId) {
      let selectedTeachers
      do {
        selectedTeachers = teachers[Math.floor(Math.random() * teachers.length)]
      } while (usedTeachers.includes(selectedTeachers.id) || selectedTeachers.user_id === userId)
      return selectedTeachers
    }
    // 舊紀錄

    let count = 1
    for (const user of users) {
      count++
      const usedTeachers = comments.filter(m => m.user_id === user.id).map(m => m.teacher_id)
      for (let i = 0; i < 2; i++) {
        const teacher = getRandomTeacherExcluding(usedTeachers, user.id)
        usedTeachers.push(teacher.id)
        const lessonDay = openLessonDay(teacher.appointment, teacher.during_time)
        const pastDay = dayjs(lessonDay[i]).subtract(7 * count, 'day').format('YYYY-MM-DD HH:mm:ss')
        const chooseLessonDay = timeTools(pastDay, teacher.during_time)
        records.push({
          user_id: user.id,
          teacher_id: teacher.id,
          start_date: chooseLessonDay.startTime,
          end_date: chooseLessonDay.endTime,
          during_time: teacher.during_time,
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
