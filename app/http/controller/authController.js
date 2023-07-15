const mongoose = require("mongoose")
const user = mongoose.model("users")
const bcrypt = require('bcrypt')
const passport = require("passport")
function authController() {

    const _getRedirectUrl=(req)=>{
        return req.user.role==='admin'?'/admin/orders':'/customer/orders'
    }
    return {
        login(req, res) {
            res.render("auth/login")
        },
        postLogin(req, res, next) {  //next callback for next req works like middleware
            const { email, password } = req.body
            if ( !email || !password) {
                req.flash('error', '*All fields are mandatory')  //(key,msg)
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, User, info) => {
                //defining done here 
                //strategy-local,info is messages passed in password.js
                if (err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                if (!User) {
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(User, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
        },
        register(req, res) {
            res.render("auth/register")
        },
        async postRegister(req, res) {
            //for await we need to make the parent func async
            const { name, email, password } = req.body
            if (!name || !email || !password) {
                req.flash('error', '*All fields are required')  //(key,msg)
                req.flash('name', name)//if error name appears again prev filled
                req.flash('email', email)
                return res.redirect('/register')
            }
            //Check if email exist
            user.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('error', '*Email already taken')  //(key,msg)
                    req.flash('name', name)//if error name appears again prev filled
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })
            //Hash Password
            const hashedPassword = await bcrypt.hash(password, 10)
            //Create a user
            const User = new user({
                name,
                email,
                password: hashedPassword
            })
            User.save().then(() => {
                //Login
                return res.redirect('/')
            }).catch(err => {
                req.flash('error', '*Something went wrong')  //(key,msg)
                return res.redirect('/register')

            })
        },
        logout(req, res, next) {

            req.logout(function(err) {

                if (err) { return next(err) }

            })  
            res.redirect('/login')
            

        }
    }

}
module.exports = authController