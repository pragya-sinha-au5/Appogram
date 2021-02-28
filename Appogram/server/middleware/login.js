const mongoose = require('mongoose')
const user = mongoose.model("user")
// const user = require('../model/user')
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../key')


module.exports =(req,res,next)=>{
    // console.log(req.headers)
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({err:"You must be logged in to view page"})
    }
    const token = authorization.replace("Bearer ","")
    console.log("token",token)
    jwt.verify(token,SECRET_KEY,(err,payload)=>{
        if(err){
           return res.status(401).json({error:"You must login first!!!"})
        }
        const {_id,name,pic} = payload
      
        user.findById(_id,name,pic).then(userdata =>{
            req.User = userdata
            console.log("pay",userdata)
            next()
        })
        
    })
}