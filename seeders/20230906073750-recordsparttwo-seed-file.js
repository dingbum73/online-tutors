'use strict'
const { currentTaipeiTime, openLessonDay } = require('../helpers/time-helpers')
const dayjs = require('dayjs')

// 剩餘USERS若是無過往上課紀錄，會被撈取到
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const today = currentTaipeiTime()
    const teachers = await queryInterface.sequelize.query(
      'SELECT id,during_time,appointment,user_id FROM Teachers;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const alreadyHaveRecords = await queryInterface.sequelize.query(
      'SELECT distinct user_id FROM Records WHERE start_date < :todayDate',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        replacements: { todayDate: today }
      }
    )
    const alreadyHaveUserId = alreadyHaveRecords.map(r => r.user_id)

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE id NOT IN (:userId)',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
        replacements: { userId: alreadyHaveUserId }
      }
    )
    const records = []
    if (users) {
      // 舊紀錄：先找出不重複的User
      function getRandomTeacherExcluding (usedTeachers) {
        let selectedTeacher
        do {
          selectedTeacher = teachers[Math.floor(Math.random() * teachers.length)]
        } while (usedTeachers.includes(selectedTeacher.id))
        return selectedTeacher
      }

      for (const user of users) {
        const usedTeachers = []
        for (let i = 0; i < 2; i++) {
          const teacher = getRandomTeacherExcluding(usedTeachers)
          usedTeachers.push(teacher.id)

          const lessonDay = openLessonDay(teacher.appointment, teacher.during_time)
          const randomNum = Math.floor(Math.random() * 15) + 30
          const pastDay = dayjs(lessonDay[lessonDay.length - 1 - i]).subtract(randomNum, 'day').format('YYYY-MM-DD HH:mm:ss')

          records.push({
            user_id: user.id,
            teacher_id: teacher.id,
            start_date: pastDay,
            during_time: teacher.during_time,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      }
    }
    await queryInterface.bulkInsert('Records', records)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Records', {})
  }
}
