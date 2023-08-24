if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const exphbs = require('express-handlebars')
const router = require('./routes')


const app = express()
const port = process.env.PORT

app.engine('hbs', exphbs.create({ defaultLayout: 'main', extname: '.hbs' }).engine)
app.set('view engine', 'hbs')
app.set('views', './views')

app.use(router)

app.listen(port, () => {
  console.info(`Online-tutors web is running on http://localhost:${port}`)
})