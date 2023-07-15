 const mongoose=require("mongoose")
 const menus = mongoose.model("menus")
//require('../../models/menus')
function homeController() {

    return {
        async index(req, res) {
           
            const pizz = await menus.find();
        
            return res.render('home', { pizzas: pizz })

            //  menus.find().then(function(pizzas)
            //  {
            //      console.log(pizzas)
            //      return res.render('home',{pizzas:pizzas})
            // })
        }
    }

}
module.exports = homeController

//Factory Functions-create objects
    //full logic stored here curd controller - create,read,update and deletes