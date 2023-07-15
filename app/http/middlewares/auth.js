function auth(req,res,next){ //middleware we get req,res,next always
    if(req.isAuthenticated()){ //gets this method from passport tells if user i logged in or not
        return next() //allwoing by continuing
        
    }
    return res.redirect('/login')
}
module.exports=auth