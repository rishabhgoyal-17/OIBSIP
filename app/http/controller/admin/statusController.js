const mongoose = require("mongoose")
const Order = mongoose.model("orders")
function statusController()
{
    return{
        update(req,res)
        {
            Order.updateOne({_id:req.body.orderId},{status:req.body.status},(err,data)=>{//req.body.(name) in form
                //first record for pinpointing and second data for updating record 
                if(err)
                {
                   return res.redirect('/admin/orders')    
                }
                // Emit event
                const eventEmitter=req.app.get('eventEmitter') //getting emiiter, we get app through request
                eventEmitter.emit('orderUpdated',{id:req.body.orderId,status:req.body.status})
                return res.redirect('/admin/orders')
                //event emiiter has been emitted, now we can listen this anywhere inside eniter app
            })  
        }
    }
}
module.exports=statusController