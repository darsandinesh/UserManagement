const express = require('express')
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');

const app = express()
app.use(bodyParser.json());
app.use(flash());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// app.use(function (req, res, next) {
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Expires', '-1');
//     res.header('Pragma', 'no-cache');
//     next()
// });

// app.use(session({
//     secret: "admin-secret",
//     resave: false,
//     saveUninitialized: false
// }))

app.set('view engine', 'hbs')

var adminRouter = require('./routes/admin')
var userRouter = require('./routes/user')

app.use('/',userRouter)
app.use('/admin',adminRouter)

module.exports = app

app.listen(8888,()=>console.log("server started at port:8888"))



