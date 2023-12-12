const user = require('../models/userModel')
const bcrypt = require('bcrypt')


const addUser = async(req,res)=>{
    const userFound = await user.findOne({username:req.body.username})
    const userEmail = await user.findOne({email:req.body.email})
    
    try{
        if(userFound){
            res.redirect(`/signup?message=username already found`)
            console.log("userfound")
            console.log(userFound)
        }else if(userEmail){
            res.redirect(`/signup?emailmessage=try another email`)
        }else{
            const hashedPass = await bcrypt.hash(req.body.password,10)
            const emailUser = req.body.email
            console.log("userNotFound")
            const newUser = new user({
                username:req.body.username,
                password:hashedPass,
                email:emailUser,
                isAdmin:0
            })
            await newUser.save()
            res.redirect('/')
        }
    }catch(e){
        console.log(e.message);
        res.redirect('/error?message= something went wrong while signing up');
    }
}


const checkUserIn = async(req,res)=>{
    try{
        const checkUser = await user.findOne({username:req.body.username})
        console.log("login",checkUser)
        if(checkUser){
            const checkPass = await bcrypt.compare(req.body.password,checkUser.password)
            console.log("userFound")
            if(checkPass){
                console.log("success!!!")
                req.session.isUserAuth = true
                req.session.email=checkUser.email
                req.session.username = checkUser.username
                res.redirect(`/login/${req.session.username}`)
            }else{
                res.redirect('/?errPassword=invalid password')
            }
        }else{
            res.redirect('/?errUser=invalid username')
        }

    }catch(e){
        console.log(e.message);
        res.redirect('/error?message= something went wrong while signing up');
    }
}

const checkUserOut = async(req,res)=>{
    await req.session.destroy()
    res.redirect('/')
}

module.exports = { checkUserIn, addUser, checkUserOut}