const { Router } = require('express');
const bcrypt = require('bcryptjs')
const passport = require('passport')
const router = Router();
const User = require('../model/User');

router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Ro\'yxatdan o\'tish sahifasi'
  })
})

// Register POST
router.post('/register', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const nickname = req.body.nickname;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('username', 'Ism maydonni to\'ldiring').notEmpty()
  req.checkBody('email', 'Email maydonni to\'ldiring').notEmpty()
  req.checkBody('nickname', 'Taxallus maydonni to\'ldiring').notEmpty()
  req.checkBody('password', 'Parol maydonni to\'ldiring').notEmpty()
  req.checkBody('password2', 'Tepadagi parol bilan bir xil bo\'lish kerak').notEmpty().equals(req.body.password)

  const errors = req.validationErrors();
  if (errors) {
    res.render('register', {
      errors: errors
    })
  }
  else {
    const user = new User({
      username: username,
      email: email,
      nickname: nickname,
      password: password
    })
    bcrypt.genSalt(10, (err, pass) => {
      bcrypt.hash(user.password, pass, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        user.save((err) => {
          if (err) throw err;
          else {
            req.flash('success', 'Ro\'yxatdan o\'tdingiz');
            res.redirect('/login');
          }
        })
      })
    })
  }
})

// Login
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Kirish sahifasi'
  })
})

// Login POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'Ism yoki parol xato'
  })(req, res, next)
})

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Tizimdan muvaffaqiyatli chiqdingiz');
  res.redirect('/login');
})
module.exports = router;