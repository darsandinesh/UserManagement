var express = require('express')
const bodyParser = require('body-parser');
const user = require('../controllers/userControl')
const session = require('express-session')
const userModel=require('../models/userModel')
const userDelete = require('../controllers/adminControl')

//const flash = require('express-flash');

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

function userAuth(req, res, next) {
    if (req.session.isUserAuth) {
        next()
    } else {
        res.redirect('/')
    }
}

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    if (req.session.isUserAuth) {
        res.redirect(`/login/${req.session.username}`)
    } else {
        invalidunam = req.query.errUser
        invalidpass = req.query.errPassword

        res.render('userlogin', { invalidpass, invalidunam })
    }

})

// function deleteUser(){
//     const {deleteedUser}= userDelete.deleteUser
//     const name = deleteedUser()
//     console.log(name)
// }

router.post('/', user.checkUserIn)

router.get('/wrong',user.checkUserOut)

router.get ('/login/:username',userAuth, async(req, res) => {
    try{
        const email=req.session.email;
        const user= await userModel.findOne({email:email})
        res.render('home', { Welcome: user.username })
    } catch(e){
        console.log(e)
        //res.render('userlogin',{adminKickedUser:"Something went Worng"})  
        // console.log(count)
        // if(count == undefined){
        //     count = 1
             res.render('error',{errorMessage:"Something went Worng"})
            
        // } else {
        //     res.redirect('/')
        // }
    }
})

// router.get('/home/:username',()=>{
//     res.render('home', { Welcome: req.params.username })
// })

// router.get('/home/:username',()=>{
//     res.render('home', { Welcome: req.params.username })
// })

function userSign(req, res, next) {
    if (req.session.isUserAuth) {
        res.redirect(`/login/${req.session.username}`)
    } else{
        next()
    }
}

router.get('/signup',userSign, (req, res) => {
    unamefound = req.query.message
    emailmsg = req.query.emailmessage
    res.render('usersignup', { unamefound, emailmsg })
})



router.post('/signup', user.addUser)

router.get('/ulogout',user.checkUserOut)

router.get('/error',(req,res)=>{
    const errorMessage = req.query.errorMessage;
    console.log(errorMessage)
    res.render('error',{errorMessage});
})

// router.get('**',(req,res)=>{
//     res.status(400).render('error',{errorMessage:"Invalid request"})
// })



module.exports = router;
