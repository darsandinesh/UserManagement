var express = require('express')
const admin = require('../controllers/adminControl')
const session = require('express-session')

var router = express.Router()

router.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

router.use(session({
    secret: "admin-secret",
    resave: false,
    saveUninitialized: false
}))


function adminLogged(req,res,next){
    if(req.session.isAdmin){
        next()
    }else{
        res.redirect('/admin')
    }
}

router.get('/', (req, res) => {
    if (req.session.isAdmin) {
        console.log("Admin logged in!!")
        res.redirect(`/admin/logged/${req.session.name}`)
    } else {
        adminNot = req.query.adminNot
        passNot = req.query.notPass
        console.log("admin SignOut")
        res.render('adminlogin', { adminNot, passNot })
    }
})

router.post('/', admin.checkAdmin)

router.get('/logged/:username', adminLogged, async (req, res) => {
    console.log("adminpannel")
    const userDetails = await admin.listUser()
    //console.log(userDetails)
    res.render('adminpannel', { welcome: req.params.username, userDetails })
})

router.post('/logged/:name', admin.searchUser)

router.get('/edit',adminLogged, (req, res) => {
    oldUserName = req.query.username
    oldEmail = req.query.email
    console.log(oldUserName)
    const userfound = req.query.morethanUser
    console.log("oldusername not found")
    res.render('editUsers', { oldUserName, oldEmail, userfound })
})

router.post('/edit/:name', admin.editUser)

router.get('/delete/:name', admin.deleteUser)

router.get('/signout', admin.signOut)

router.get('/error',(req,res)=>{
    const errorMessage = req.query.message
    res.render('error',{errorMessage})
})


module.exports = router