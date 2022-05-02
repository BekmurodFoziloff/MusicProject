const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../model/User')

module.exports = (passport) => {
    passport.use(
        new LocalStrategy(
            function verify(username, password, done) {
                User.findOne({ username: username }, (err, user) => {
                    if (err) { return done(err) }
                    if (!user) {
                        return done(null, false, { message: 'Taxallusingiz noto\'g\'ri' })
                    }
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err
                        if (isMatch) {
                            done(null, user)
                        }
                        else {
                            done(null, false, { message: 'Parolingiz noto\'g\'ri' })
                        }
                    })
                })
            }))
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user)
        })
    })
}