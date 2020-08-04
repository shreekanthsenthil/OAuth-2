const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const passport = require('passport')
const cookieSession = require('cookie-session')

dotenv.config({path: './.env'})

require('./passport-setup')

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

app.use(cookieSession({
    name: 'OAuth Session',
    keys: ['key1', 'key2']
  }))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

const mustBeLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/login', (req,res) => {
    if(req.user) {
        res.redirect('/')
    } else {
        res.render('login')
    }
})

app.get('/',mustBeLoggedIn, (req, res) => {
    res.render('welcome', {name: req.user.displayName})
})

//GOOGLE
app.get('/oauth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

//FACEBOOK
app.get('/oauth/facebook', passport.authenticate('facebook'))

app.get('/facebook/callback',passport.authenticate('facebook', {failureRedirect: '/login'}), function(req, res) {
    res.redirect('/')
})

app.post('/logout', (req, res) => {
    req.session = null;
    req.logout()
    res.redirect('/')
})

app.listen(process.env.PORT)