const mongoose = require("mongoose")
const order = mongoose.model("orders")

function orderController() {
  return {
    index(req, res) {
      order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 } }).populate('customerId', '-password').exec((err, orders) => {
        //populate helps to get all details of customer with help of customer Id 
        //-password is passed so that we dont get password
        if (req.xhr) {
          //xhr are http request objects are used to intract with servers 

          return res.json(orders)
        }
        else {
          return res.render('admin/orders')
        }
      })
      // order.where('status').ne('completed').sort({ createdAt: -1 }).populate('customerId','- password').exec((err, orders) => 
      // {
      //   if (req.xhr) {
      //     //         //xhr are http request objects are used to intract with servers 

      //     return res.json(orders)
      //   }
      //   else {
      //     return res.render('admin/orders')
      //   }
      // })
      //     if (req.xhr) {
      //         //xhr are http request objects are used to intract with servers 

      //         return res.json(orders)
      //     }
      //     else {
      //         return res.render('admin/orders')
      //     }
      // })

      //     order.find().populate({
      //         path: 'status',
      //         match: {
      //           type: 'order_placed'
      //         }
      //       }).exec(function(err, orders) {
      //         orders = orders.filter(function(Order) {
      //             if(req.xhr)
      //           return Order.status 
      //         })
      //       })
      //       return  res.render('admin/orders')
      // }
    }
  }
}
module.exports = orderController