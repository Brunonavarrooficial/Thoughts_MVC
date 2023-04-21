const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()

const conn = require('./db/conn')

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

app.use(express.static('public'))

// Models
const User = require('./models/User')
const Thoughts = require('./models/Thoughts')

// Rotes
const thoughtsRoutes = require('./routes/thoughtsRoutes')
const authRoutes = require('./routes/authRoutes')

// Controllers
const ThoughtsController = require('./controllers/ThoughtsController')

// session middleware
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true,
        }
    }),
)

// flash messages
app.use(flash())

//set session to res
// app.use((req, res, next) => {
//     if (req.session.userid) {
//         res.locals.session = req.session
//         return
//     }

//     next()

// })
app.use((req, res, next) => {

    console.log('app.use meddleware => ', req.session.userid);

    if (req.session.userid) {
        res.locals.session = req.session;
    }

    next();
});

app.use('/thoughts', thoughtsRoutes)
app.use('/', authRoutes)

app.get('/', ThoughtsController.showThoughts)

conn
    .sync()
    //.sync({ force: true })
    .then(() => {
        app.listen(3000, () => {
            console.log('Conectado a porta http://localhost:3000')
        })
    })
    .catch((err) => { console.log('erro na conexão => ', err) })