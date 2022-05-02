const express = require('express')
const path = require('path')
const bodyParse = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const app = express()

// Validatorlar
const expressValidator = require('express-validator')
const session = require('express-session')

// for navigation message
// Express-Messages
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Express_Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))

// Express_Validator
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']'
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))

app.use(bodyParse.urlencoded({ extended: true }))
app.use(bodyParse.json())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'public')))

// Passport ulash
require('./helper/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

// User init
app.get('*', (req, res, next) => {
    res.locals.user = req.user || null
    next()
})

mongoose.connect(require('./helper/db').MONGO_URL)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log('MongoDBga lokal ulandi...')
})

app.use('/', require('./routes/music'))
app.use('/', require('./routes/user'))

const port = 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))