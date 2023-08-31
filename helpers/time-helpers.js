const dayjs = require('dayjs')

const calculate = (appointment, madeAppointment, during) => {
  let newDay = dayjs()
  const afterTwoWeeks = newDay.add(14, 'day')
  const startTime = '18:00'
  const endTime = '22:01'
  const newAppointment = []

  while (newDay.isBefore(afterTwoWeeks)) {
    newDay = newDay.add(1, 'day')
    if (appointment.map(x => parseInt(x)).includes(newDay.day())) {
      let currentTime = dayjs(`${newDay.format('YYYY-MM-DD')} ${startTime}`)
      const endingTime = dayjs(`${newDay.format('YYYY-MM-DD')} ${endTime}`)
      while (currentTime.isBefore(endingTime)) {
        newAppointment.push(currentTime.format('YYYY-MM-DD HH:mm'))
        currentTime = currentTime.add(parseInt(during), 'minute')
      }
    }
  }

  const result = newAppointment.filter(e => {
    return madeAppointment.indexOf(e) === -1
  }).concat(madeAppointment.filter(f => {
    return newAppointment.indexOf(f) === -1
  }))
  return result
}

module.exports = {
  calculate
}
