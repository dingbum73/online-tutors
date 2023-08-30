document.addEventListener('DOMContentLoaded', function () {
  const teacherId = document.getElementById('teacher-id').value
  const button = document.querySelector('#chooseLesson')
  const appointment = document.querySelector('#appointment')
  const chooseLessonContent = document.querySelector('#choose-lesson-modal')
  button.addEventListener('click', function () {
    axios.get(`/lessons/${teacherId}`)
      .then(response => {
        console.log(response)
        const selectedValue = appointment.value
        chooseLessonContent.value = selectedValue
      }).catch(err => console.log(err))
  })
})
