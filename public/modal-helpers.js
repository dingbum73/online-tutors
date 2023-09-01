document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('#chooseLesson')
  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault()
      const teacherId = document.getElementById('teacher-id').value
      const chooseTime = document.querySelector('#choose-time')
      const chooseLessonContent = document.querySelector('#choose-lesson-modal')
      const teacherUrlModal = document.querySelector('#teacher-url-modal')
      const chooseLessonModalLabel = document.querySelector('#chooseLessonModalLabel')
      axios.post(`/lessons/${teacherId}`, { appointment: chooseTime.value })
        .then(response => {
          const newRecord = response.data
          if (!newRecord.startDate) {
            chooseLessonContent.value = ''
            teacherUrlModal.value = ''
            chooseLessonModalLabel.textContent = `預約失敗:${newRecord.info}`
          }
          chooseLessonContent.value = newRecord.startDate
        }).catch(err => {
          console.log(err)
        })
    })
  }
  const modalCloseBtn = document.querySelector('#modal-close')

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', function () {
      window.location.reload()
    })
  }
})
