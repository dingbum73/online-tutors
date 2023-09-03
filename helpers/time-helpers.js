const dayjs = require('dayjs')

// 須帶入三組參數：老師可預約的星期（arr）、已經被預約的日期（arr）、上課時長
// 找出老師可上課的時間
const calculate = (appointment, madeAppointment, duringTime) => {
  let newDay = dayjs()
  const afterTwoWeeks = newDay.add(14, 'day')
  const startTime = '18:00' // 可預約開始時間
  const endTime = '22:01'
  const newAppointment = []

  while (newDay.isBefore(afterTwoWeeks)) {
    newDay = newDay.add(1, 'day')
    if (appointment.map(x => parseInt(x)).includes(newDay.day())) {
      let currentTime = dayjs(`${newDay.format('YYYY-MM-DD')} ${startTime}`)
      const endingTime = dayjs(`${newDay.format('YYYY-MM-DD')} ${endTime}`)
      while (currentTime.isBefore(endingTime)) {
        newAppointment.push(currentTime.format('YYYY-MM-DD HH:mm'))
        currentTime = currentTime.add(parseInt(duringTime), 'minute')
      }
    }
  }

  const result = deDuplicate(newAppointment, madeAppointment)
  return result
}

// 新舊預約去重複
const deDuplicate = (newAppointment, madeAppointment) => {
  const result = newAppointment.filter(e => {
    return madeAppointment.indexOf(e) === -1
  }).concat(madeAppointment.filter(f => {
    return newAppointment.indexOf(f) === -1
  }))
  return result
}

// 是否被預約了，被預約返回TRUE
const isBooking = (newAppointment, madeAppointment) => {
  return madeAppointment.some(x => x === newAppointment)
}

// 回傳日期、開始時間、結束時間
const timeTools = (startDate, duringTime) => {
  const newDay = dayjs(startDate).format('YYYY-MM-DD')
  const startTime = dayjs(startDate).format('YYYY-MM-DD HH:mm')
  const endTime = dayjs(startDate).add(duringTime, 'minute').format('YYYY-MM-DD HH:mm')
  return {
    newDay, startTime, endTime
  }
}
// 新預約的課程是否與已經預約的課程重疊
// 預約選課時間是否重複了  madeAppointment 是物件 { }
const isRepeat = (newAppointment, duringTime, findRecords) => {
  const newRes = timeTools(newAppointment, duringTime)
  for (const x of findRecords) {
    const res = timeTools(x.startDate, x.duringTime)
    if (res.newDay !== newRes.newDay) continue
    if (dayjs(newRes.startTime).isSame(res.startTime) || dayjs(newRes.endTime).isSame(res.endTime) || (dayjs(newRes.startTime).isAfter(res.startTime) && dayjs(newRes.startTime).isBefore(res.endTime))) {
      return true
    }
  }
  return false
}

// 確認老師目前可上課的日期與前端請求的日期相同：請求正確返回true
// teacherAppointment [] ,userAppointment 字串
const isOpen = (teacherAppointment, userAppointment) => {
  const today = dayjs().format('YYYY-MM-DD')
  const newDay = dayjs(userAppointment).day()
  if (dayjs(userAppointment).format('YYYY-MM-DD').isBefore(today)) return false
  if (teacherAppointment.map(x => parseInt(x)).includes(newDay)) return true
  return false
}

module.exports = {
  calculate,
  deDuplicate,
  isBooking,
  isRepeat,
  isOpen
}
