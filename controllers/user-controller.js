const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body
    try {
      if (!name || !email || !password || !confirmPassword) throw new Error('全部欄位都需填寫')
      if (name === password) throw new Error('名字密碼不可相同！')
      if (password !== confirmPassword) throw new Error('密碼輸入不同！')
      if (!email.includes('@')) throw new Error('email格式不正確')

      const user = await User.findOne({ where: { email } })

      if (user) throw new Error('此email已經註冊過了')

      const hash = await bcrypt.hash(password, 10)

      await User.create({
        name,
        email,
        password: hash
      })

      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout(() => {
      res.redirect('/signin')
    })
  },
  getUser: async (req, res, next) => {
    const { id } = req.params
    try {
      const user = await User.findByPk(id, { raw: true })
      console.log(user)
      if (!user) throw new Error('此用戶不存在')
      return res.render('users/profile', { user })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
