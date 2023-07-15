const mongoose = require("mongoose")
const Order = mongoose.model("orders")
const moment = require('moment')
function orderController() { //Factory Function always require return
    return {
        store(req, res) //called method
        {
          
            //Validate request
            const { phone, address } = req.body
            if (!phone || !address) {
                req.flash('error', '*All fields are mandatory')
                return res.redirect('/cart')
            }
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone: phone,
                address: address
            })
            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                   req.flash('success', 'Order placed successfully')
                    delete req.session.cart
                    //Emit
                    //for real time update on admin dashboard
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', placedOrder)  //result=saved order here
                    // return res.json({message:'Order Placed successfully'}) ;
                    return res.redirect('/customer/orders')
                })
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/cart')
            })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } }) //fetched all orders createdAt-1 make time latest order at top
            res.header('Cache-Control', 'no-cache,private,no-store,must-revaidate,max-stale=0,post-check=0,pre-check=0')
            res.render('customers/orders', { orders: orders, moment: moment })
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)   //req.params.id as in route /customer/orders/:id
            //Authorize user, one user can see only its own order status
            if (req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order: order })
            }
            return res.redirect('/')


        }





    }
}
module.exports = orderController
