const authController = require('../app/http/controller/authController')
const homeController=require('../app/http/controller/homeController')
const cartController=require('../app/http/controller/customers/cartcontroller')
const orderController=require('../app/http/controller/customers/orderController')


const adminOrderController=require('../app/http/controller/admin/orderController')
const statusController=require('../app/http/controller/admin/statusController')
//import k liye require use

//middleware
const guest=require('../app/http/middlewares/guest')
const auth=require('../app/http/middlewares/auth')
const admin=require('../app/http/middlewares/admin')

function initRoutes(app) {
    // app.get('/', (req, res) => {
    //     res.render("home") //page read through this
    //     //get method called, 2 parameters passed
    

    app.get('/',homeController().index)
        
    


    

    // app.get('/login', (req, res) => {
    //     res.render("auth/login");
    // })
    app.get('/login',guest,authController().login)
    app.post('/login',authController().postLogin)
    app.get('/register',guest,authController().register)
    // app.get('/register', (req, res) => {
    //     res.render("auth/register");
    // })
    app.post('/register',authController().postRegister)
    app.get('/logout',authController().logout)
    app.get('/cart',cartController().index )
    app.post('/update-cart',cartController().update)

    //Customer routes
    app.post('/orders',auth,orderController().store)//by middlewaye auth we allow only logged in user
    app.get('/customer/orders',auth,orderController().index) //middlware is always passed as 2nd parameter
   app.get('/customer/orders/:id',auth,orderController().show)

    //Admin routed
    app.get('/admin/orders',admin,adminOrderController().index)
   app.post('/admin/order/status',admin,statusController().update)
}

module.exports = initRoutes