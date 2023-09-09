document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('#chooseLesson')
  const commentBtn = document.querySelector('#commentBtn')
  const modalCloseBtn = document.querySelector('#modal-close')
  const modalCloseOnComments = document.querySelector('#modalCloseOnComments')
  const scoreModalLabel = document.querySelector('#scoreModalLabel')
  const scores = document.querySelector('#scores')
  const comment = document.querySelector('#comment')
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
            chooseLessonModalLabel.textContent = '預約成功'
            chooseLessonContent.value = newRecord.startDate
            teacherUrlModal.value = newRecord.url
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
    commentBtn.classList.remove('invisible')
    axios.get(`/comments/${teacherId}`)
      .then(response => {
        const teacher = response.data
        teacherOnModal.value = teacher.id
        if (teacher.info) {
          scoreModalLabel.textContent = `無法評分：${teacher.info}`
          teacherName.value = '--'
          scores.disabled = true
          comment.disabled = true
          commentBtn.classList.add('invisible')
          modalCloseOnComments.classList.remove('invisible')
        } else {
          teacherName.value = teacher.name
        }
      }).catch(err => {
        console.log(err)
      })
  })
  const scoreButton = new bootstrap.Modal(scoreModal)

  // POST COMMENT；commentBtn
  if (commentBtn) {
    commentBtn.addEventListener('click', function (event) {
      event.preventDefault()
      const teacherOnModal = document.querySelector('#teacherOnModal')
      axios.post('/comments', { teacherId: teacherOnModal.value, scores: scores.value, text: comment.value })
        .then(response => {
          const newComment = response.data
          if (newComment.info === '未上過此課程') {
            scoreModalLabel.textContent = `無法評分：${newComment.info}`
            scores.disabled = true
            comment.disabled = true
            commentBtn.classList.add('invisible')
            modalCloseOnComments.classList.remove('invisible')
          } else if (newComment.info) {
            scoreModalLabel.textContent = `${newComment.info}`
          } else {
            scoreModalLabel.textContent = '評分成功'
            scores.disabled = true
            comment.disabled = true
            commentBtn.classList.add('invisible')
            modalCloseOnComments.classList.remove('invisible')
          }
        }).catch(err => {
          console.log(err)
        })
    })
  }

  if (modalCloseOnComments) {
    modalCloseOnComments.addEventListener('click', function () {
      window.location.reload()
    })
  }
})
