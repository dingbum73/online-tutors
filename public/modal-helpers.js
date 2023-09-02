document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('#chooseLesson')
  const modalCloseBtn = document.querySelector('#modal-close')
  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault()
      const teacherId = document.getElementById('teacher-id').value
      const chooseTime = document.querySelector('#choose-time')
      const chooseLessonContent = document.querySelector('#choose-lesson-modal')
      const teacherUrlModal = document.querySelector('#teacher-url-modal')
      const chooseLessonModalLabel = document.querySelector('#chooseLessonModalLabel')
      axios.post('/api/records', { appointment: chooseTime.value, id: teacherId })
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
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', function () {
      window.location.reload()
    })
  }
})
