const express = require('express')
const users = require('./user');
const app = express()
const mongoose = require('mongoose')
const {MONGOURL} = require('./key')
const PORT = 5000
var cors = require("cors");
const http = require("http");
// const User = require("./model/user")
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);



mongoose.connect(MONGOURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
})
mongoose.connection.on('connected',()=>{
   console.log("connected to mongodb")
})
mongoose.connection.on('error',(err)=>{
    console.log("error in connection",err)
 })

require('./model/user')
require('./model/post')
require('./model/message')
const User = mongoose.model('user')
const Message = mongoose.model('message')
io.on("connection", socket => {
    let friendIdUser
    // socket.emit("your id", socket.id);
    socket.on("your id",id =>{
        let sender = users.create(socket,id);
     })
     socket.on("send message",async({body,to,from})=>{
        console.log("b",body,"uid", from,"fid", to);
       const yourIdUser =await User.findOne({ _id: from });
      friendIdUser =await  User.findOne({ _id: to});
    
       var obj ={
             from:yourIdUser._id,
             to:friendIdUser._id,
             body:body,
            
             
             
       }
      const mesg = new Message(obj)
      mesg.save();
            const receiver = users.get(friendIdUser._id);
            receiver.emit("message",{body,from,to})
    })
})



app.use(express.json())
app.use(cors());
app.use(require('./routes/auth'))
app.use(require('./routes/user'));
app.use(require('./routes/post'));


server.listen(PORT,()=>{
    console.log("server on PORT",PORT)
})



