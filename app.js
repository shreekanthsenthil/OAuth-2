const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

app.get('/', (req,res) => {
    res.render('login')
})

app.listen(3000)