const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    const user = getUser(req)
    if (user.strategy === 'localStrategylocal') return next()
    res.redirect('/admin')
  } else {
    req.flash('error_messages', '請先登入才能使用')
    res.redirect('/signin')
  }
}

const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    const user = getUser(req)
    if (user.strategy === 'localStrategyAdmin') return next()
    res.redirect('/')
  } else {
    req.flash('error_messages', '請先登入才能使用')
    res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
