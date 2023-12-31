const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

// 找到台北時區
const currentTaipeiTime = () => {
  return dayjs().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss')
}

// 找到台北時區並加7天
const currentTaipeiTimeAddSeven = () => {
  return dayjs(currentTaipeiTime()).add(7, 'day').format('YYYY-MM-DD HH:mm:ss')
}

// 回傳日期、開始日期時間、結束日期時間
const timeTools = (startDate, duringTime) => {
  const newDay = dayjs(startDate).format('YYYY-MM-DD')
  const startTime = dayjs(startDate).format('YYYY-MM-DD HH:mm:ss')
  const endTime = dayjs(startDate).add(duringTime, 'minute').format('YYYY-MM-DD HH:mm:ss')
  return {
    newDay, startTime, endTime
  }
}

// 是否是未來時間
const isLessonInFuture = madeAppointment => {
  const madeAppointmentInfuture = []
  let todayAddOne = dayjs()
  todayAddOne = todayAddOne.add(1, 'day')
  for (const x of madeAppointment) {
    const res = timeTools(x, 0)
    if (!dayjs(res.newDay).isBefore(todayAddOne.format('YYYY-MM-DD'))) {
      madeAppointmentInfuture.push(x)
    }
  }
  return madeAppointmentInfuture
}

// 去除重複
const deDuplicate = (newAppointment, madeAppointment) => {
  const result = newAppointment.filter(time => !madeAppointment.includes(time))
  return result
}

// 是否被預約了，被預約返回TRUE
const isBooking = (newAppointment, madeAppointment) => {
  return madeAppointment.some(x => x === newAppointment)
}

// 確認老師目前可上課的日期與前端請求的日期相同：請求正確返回true
// teacherAppointment [] ,userAppointment 字串
const isOpen = (teacherAppointment, userAppointment) => {
  const today = dayjs()
  const newDay = dayjs(userAppointment).format('YYYY-MM-DD')
  if (dayjs(newDay).isBefore(today.format('YYYY-MM-DD'))) return false
  if (teacherAppointment.map(x => parseInt(x)).includes(dayjs(newDay).day())) return true
  return false
}

// 須帶入參數：老師可預約的星期（arr）、上課時長
// 找出老師未來可上課的時間
const openLessonDay = (appointment, duringTime) => {
  let newDay = dayjs()
  const afterTwoWeeks = newDay.add(14, 'day')
  const startTime = '18:00:00' // 可預約開始時間
  const endTime = '21:30:00'
  const newAppointment = []

  while (newDay.isBefore(afterTwoWeeks)) {
    newDay = newDay.add(1, 'day')
    if (appointment.map(x => parseInt(x)).includes(newDay.day())) {
      let currentTime = dayjs(`${newDay.format('YYYY-MM-DD')} ${startTime}`)
      const endingTime = dayjs(`${newDay.format('YYYY-MM-DD')} ${endTime}`)
      while (currentTime.isBefore(endingTime)) {
        newAppointment.push(currentTime.format('YYYY-MM-DD HH:mm:ss'))
        currentTime = currentTime.add(parseInt(duringTime), 'minute')
      }
    }
  }
  return newAppointment
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

// 加入(ddd)
const resultAdd = result => result.map(dateStr => {
  const day = dayjs(dateStr)
  return day.format('YYYY-MM-DD(ddd)HH:mm:ss')
})

// appointment老師可預約的星期[],madeAppointment已被預約的日期[],duringTime老師的上課時長
// 回傳老師可以預約的時間'YYYY-MM-DD(ddd)HH:mm:ss' []
const calculate = (appointment, madeAppointment, duringTime) => {
  const madeAppointmentFilter = isLessonInFuture(madeAppointment)
  const newAppointmentFilter = openLessonDay(appointment, duringTime)
  const result = deDuplicate(newAppointmentFilter, madeAppointmentFilter)
  const finalResult = resultAdd(result)
  return finalResult
}

module.exports = {
  currentTaipeiTime,
  currentTaipeiTimeAddSeven,
  openLessonDay,
  calculate,
  deDuplicate,
  isBooking,
  isRepeat,
  isOpen,
  timeTools
}
