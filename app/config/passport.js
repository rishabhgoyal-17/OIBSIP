const mongoose = require("mongoose")
const user = mongoose.model("users")
const LocalStrategy = require('passport-local').Strategy //passport-local added from terminal 
const bcrypt = require('bcrypt') //package already installed for crypting password 
function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        //Login
        //check if email exist
        const User = await user.findOne({ email: email })  //if email exist we get the user 
        if (!User) {
            return done(null, false, { message: 'User not found' })
        }
        bcrypt.compare(password, User.password).then(match =>//comparing given password with the one in database
        {
            if (match) {
                return done(null, User, { message: 'Logged in Successfully' })
            }
            return done(null, false, { message: 'Invalid Credentials' })
        }).catch(err => {
            return done(null, false, { message: 'Something went wrong' })
        })

    }))
    passport.serializeUser((User, done) => //method allow us ,inside session storing user id to know if user is logged in or not 
    {
        done(null, User._id) //first paramater in done is error
    })
    passport.deserializeUser((id, done) => {
        user.findById(id, (err,User) => { //running query findByid in database
            done(err, User)
        })
        //can use user.findOne({_id:id})
    })
}
module.exports = init