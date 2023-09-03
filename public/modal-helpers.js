document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('#chooseLesson')
  const commentBtn = document.querySelector('#commentBtn')
  const modalCloseBtn = document.querySelector('#modal-close')
  const btnClose = document.querySelector('btn-close')
  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault()
      const teacherId = document.getElementById('teacher-id').value
      const chooseTime = document.querySelector('#choose-time')
      const chooseLessonContent = document.querySelector('#choose-lesson-modal')
      const teacherUrlModal = document.querySelector('#teacher-url-modal')
      const chooseLessonModalLabel = document.querySelector('#chooseLessonModalLabel')
      axios.post('/api/records', { appointment: chooseTime.value, teacherId })
        .then(response => {
          const newRecord = response.data
          if (!newRecord.startDate) {
            chooseLessonContent.value = '--'
            teacherUrlModal.value = '--'
            chooseLessonModalLabel.textContent = `預約失敗:${newRecord.info}`
          } else {
            chooseLessonContent.value = newRecord.startDate
          }
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

  // Comment Modal
  const scoreModal = document.getElementById('scoreModal')
  scoreModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget
    const teacherId = button.getAttribute('data-teacher-id')
    const teacherName = document.querySelector('#teacherName')
    const teacherOnModal = document.querySelector('#teacherOnModal')
    axios.get(`/comments/${teacherId}`)
      .then(response => {
        const teacher = response.data
        teacherName.value = teacher.name
        teacherOnModal.value = teacher.id
      }).catch(err => {
        console.log(err)
      })
  })
  const scoreButton = new bootstrap.Modal(scoreModal)

  // POST COMMENT；commentBtn
  if (commentBtn) {
    commentBtn.addEventListener('click', function (event) {
      event.preventDefault()
      const scoreModalLabel = document.querySelector('#scoreModalLabel')
      const teacherOnModal = document.querySelector('#teacherOnModal')
      const scores = document.querySelector('#scores')
      const comment = document.querySelector('#comment')
      console.log('scores', scores.value)
      axios.post('/comments', { teacherId: teacherOnModal.value, scores: scores.value, text: comment.value })
        .then(response => {
          const newComment = response.data
          console.log(newComment)
          scoreModalLabel.textContent = '評分成功'
        }).catch(err => {
          console.log(err)
        })
    })
  }

  if (btnClose) {
    btnClose.addEventListener('click', function () {
      window.location.reload()
    })
  }
})
