const express = require('express')
const mongoose = require('mongoose')
const login = require('../middleware/login')
const Post = mongoose.model("Post")
const User =  mongoose.model("user")
const Message = mongoose.model('message')
const router = express.Router()




router.get("/following",login,(req,res)=>{
    User.find({_id:req.User.following })
    .populate("User","_id name email pic")
    .select('-password ')
    .sort('-createdAt')
    .then(user=>{
        res.json({user})
        console.log("users",user)
    }).catch(err=>{
        console.log(err)
    })

})

router.get("/followers",login,(req,res)=>{
    User.find({_id:req.User.followers })
    .populate("User","_id name email pic")
    .select('-password ')
    .sort('-createdAt')
    .then(user=>{
        res.json({user})
        console.log("users",user)
    }).catch(err=>{
        console.log(err)
    })

})


router.put('/follow',login,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.User._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({err:err})
        }
        User.findByIdAndUpdate(req.User._id,{
            $push:{following:req.body.followId},
            
        },{new:true}).populate('following','_id name email').populate('followers','_id name email').select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({err:err})
        })
    })
})

router.put('/unfollow',login,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.User._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({err:err})
        }
        User.findByIdAndUpdate(req.User._id,{
            $pull:{following:req.body.unfollowId},
            
        },{new:true}).populate('following','_id name email').populate('followers','_id name email').select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({err:err})
        })
    })
})

router.get("/recomendation",login,(req,res)=>{
    User.find({_id:{$ne:req.User._id}})
    .populate("User","_id name email pic ")
    .populate("User following ","_id name email ")
    .populate("followers","_id name email pic ")
    .select('-password')
    .sort('-createdAt')
    .then(users =>{
        
        res.json({users})
    })
    .catch(err=>{
        console.log(err)
    })

})
//{$and:[{following:{$ne:req.User.following._id, $exists: true }},{ _id: {$ne:req.User._id}}] }
router.get('/user/:id',login,(req,res)=>{
   User.findOne({_id:req.params.id})
   .select("-password")
   .then(user=>{

      Post.find({postedBy:req.params.id})
      .populate("postedBy","_id name pic")
      .exec((err,posts)=>{
          if(err){
              return res.status(422).json({error:err})
          }
          else{
               res.json({user,posts})
          }
      })

   }).catch(err=>{
    return res.status(404).json({err:"user not found"})
})
})

router.get("/Otherfollow/:id",login,(req,res)=>{
    User.findOne({_id:req.params.id })
    .populate("following","_id name email pic")
    .populate("followers","_id name email pic")
    .select('-password ')
    .sort('-createdAt')
    .then(user=>{
        res.json({user})
        console.log("users",user)
    }).catch(err=>{
        console.log(err)
    })

})


router.put("/updatePic/:id",login,(req,res)=>{
    User.findByIdAndUpdate(req.User._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
       
            if(err){
                return res.status(400).json({
                    error:"email already exist"
                })
            }else{
                    res.json(result)
                }
        })
})
router.put("/updateProfile/:id",login,(req,res)=>{
    
    User.findByIdAndUpdate(req.User._id,{$set:{name:req.body.name,email:req.body.email}},{new:true},
       (err,result)=>{
         if(err){
             return res.status(422).json({error:"data cannot update"})
         }
         res.json(result)
        
        })
    
})
router.delete("/deleteuser/:userId",login,(req,res)=>{
    User.findOne({_id:req.params.userId})
    .populate("user","_id pic")
    .exec((err,user)=>{
        console.log("post",user)
        if(err||!user){
            return  res.status(422).json({err:err})
        }
       if(user._id.toString() === req.User._id.toString()){
             User.remove()
             .then(result=>{
                 res.json(result)
             }).catch(err=>{

                 console.log(err)
             })
       }
    })
})

router.post("/search-users",(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({name:{$regex:userPattern}})
    .select("_id name pic email")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })
})



module.exports = router