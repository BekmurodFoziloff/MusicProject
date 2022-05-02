const { Router } = require('express')
const router = Router()

const Music = require('../model/Music')
const User = require('../model/User')

// eA = Middlware
const eA = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    }
    else {
        req.flash('danger', 'Iltimos ro\'yxatdan o\'ting!')
        res.redirect('/login')
    }
}

router.get('/', (req, res) => {
    Music.find({}, (err, music) => {
        if (err) throw err
        res.render('index', {
            title: 'Bosh sahifa',
            musics: music
        })
    })
})

// Musiqa qo'shish sahifasi
router.get('/music/add', eA, (req, res) => {
    res.render('music_add', { title: 'Musiqa qo\'shish sahifasi' })
})

// Musiqa qo'shish sahifasi POST methodi orqali bazaga jo'natish
router.post('/music/add', eA, (req, res) => {
    req.checkBody('singer', 'Ijrochi maydonni to\'ldiring').notEmpty()
    req.checkBody('name', 'Musiqa nomi maydonni to\'ldiring').notEmpty()
    req.checkBody('comment', 'Izoh maydonni to\'ldiring').notEmpty()

    const errors = req.validationErrors()
    if (errors) {
        res.render('music_add', {
            title: 'Musiqa qo\'shish validator',
            errors: errors
        })
    }
    else {
        const music = new Music()
        music.singer = req.user._id
        music.name = req.body.name
        music.comment = req.body.comment
        music.save((err) => {
            if (err) throw err
            else {
                req.flash('success', 'Musiqa muvaffaqiyatli qo\'shildi')
                res.redirect('/')
            }
        })
    }
})

router.get('/musics/:id', eA, (req, res) => {
    Music.findById(req.params.id, (err, music) => {
        // User
        User.findById(music.singer, (err, user) => {
            res.render('musics', {
                title: 'Musiqani o\'zgartirish sahifasi',
                singer: music.name,
                music: music
            })
        })

    })
})

router.get('/music/edit/:id', eA, (req, res) => {
    Music.findById(req.params.id, (err, music) => {
        if (music.singer != req.user._id) {
            req.flash('danger', 'Mumkin emas!')
            res.redirect('/')
        }
        res.render('music_edit', {
            title: 'Musiqani o\'zgartirish',
            music: music
        })
    })
})

// Musiqa o'zgartirish sahifasi
router.post('/music/edit/:id', eA, (req, res) => {
    const music = {}
    music.singer = req.body.singer
    music.name = req.body.name
    music.comment = req.body.comment
    const query = { _id: req.params.id }
    Music.updateOne(query, music, (err) => {
        if (err) throw err
        else {
            req.flash('warning', 'Muvaffaqiyatli o\'zgartirildi')
            res.redirect('/')
        }
    })
})

router.delete('/musics/:id', eA, (req, res) => {
    if (!req.user._id) {
        res.status(500).send()
    }

    let query = { _id: req.params.id }

    Music.findById(req.params.id, (err, music) => {
        if (music.singer != req.user._id) {
            res.status(500).send()
        }
        else {
            Music.deleteOne(query, (err) => {
                if (err) throw err
                req.flash('danger', 'Muvaffaqiyatli o\'chirildi')
                res.send('Success')
            })
        }

    })
})

module.exports = router