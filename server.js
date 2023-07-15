require('dotenv').config()
const express=require("express")
const app=express()
const PORT=process.env.PORT||3000
const ejs=require("ejs")
const path=require("path")
const expresslayout=require("express-ejs-layouts")
const mongoose=require("mongoose")
const session=require('express-session')
const flash=require('express-flash')//flash msgs are only for single messages
const MongoDbStore=require('connect-mongo')
const passport=require('passport')
const Emitter=require('events')
const { error } = require("console")

//Database connection
 const url="mongodb+srv://user:@cluster0.pu5r6cw.mongodb.net/?retryWrites=true&w=majority"

 mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true});

const connection=mongoose.connection;

 connection.once('open',()=>{
     console.log("Database connected...");
 }).catch(err =>    {
         console.log(" connection failed...")
     });

   
require('./app/models/menus.js')
require('./app/models/user.js')
require('./app/models/orders.js')





//Session store
// let mongoStore=new MongoDbStore({
//     mongooseConnection:connection,
//     collection:'sessions'
// })

//Event emitter
const eventEmitter=new Emitter()  //emitter is used for connecting differents events in different files
app.set('eventEmitter',eventEmitter) //binding eventemiiter with express app, can use this now in whole application

//Session config
app.use(session({
    secret:process.env.COOKIE_SECRET,  //session wont work without cookies nd cookies need to be encrypt
    resave:false,
    store:MongoDbStore.create({
        mongoUrl:"mongodb+srv://user:KXLbMD6IVjRfK5zq@cluster0.pu5r6cw.mongodb.net/?retryWrites=true&w=majority",
        
    }),
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24}   //24hrs
}))  ///session works as middleware thats why we use app.use   

//Passport config
const passportInit=require('./app/config/passport') //importing exported functn of passport.js  
passportInit(passport) //passport parameter passed whch can be fetched in passport.js
app.use(passport.initialize())
app.use(passport.session())




app.use(flash())
//Asset
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))//express doesnt know whih type of data it is receiving (this func related to register)
app.use(express.json())//inside express bydefault json data cant be accepted so to enable that


//Global middleware

app.use((req,res,next)=>
{
   
    res.locals.session=req.session
    res.locals.User=req.user
    
    next()
})  

//set template engine
app.use(expresslayout)
app.set("views",path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app); 
 app.use((req,res)=>{
     res.status(404).send('<h1>404,Page not found</h1> ')

 })

const server= app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}` );
})

//Socket 
const io = require('socket.io')(server)
io.on('connection',(socket)=>
{
    //if client get connected, we want them to join a private room
    //room name must be unique for the order
    //Join 
  console.log(socket.id)
     socket.on('join',(roomName)=>{
           //'join' is event received from client
           console.log(roomName)
         socket.join(roomName)
    })
})
 eventEmitter.on('orderUpdated',(data)=>{
   io.to(`order_${data.id}`).emit('orderUpdated',data)
 //emitting event on private room of socket which will be listened on client
 })


 //Admin side real time 
 eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
  //emitting event on private room which will be listened on client
  })