const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const login = require('../middleware/login')
const Post = mongoose.model("Post")


router.get("/allposts",login,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .populate("likes.postedBy","_id name pic")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
        console.log(posts)
    })
    .catch(err=>{
        console.log(err)
    })
})
router.post('/createpost',login,(req,res)=>{
    const {title,body,pic} = req.body
    if(!title  || !pic){
        return res.status(422).json({error:"Please fill the fields"})
    }
    req.User.password = undefined
    const post = new Post({
        title,
        // body,
        photo:pic,
        postedBy:req.User

    })
    post.save().then(result=>{
        res.json({post:result})
    
    }).catch(err =>{
        console.log(err)
    })
})
router.get("/myposts",login,(req,res)=>{
    Post.find({postedBy:req.User._id})
    .populate("postedBy","_id name pic")
    .then(mypost=>{
        res.json({mypost})
    }).catch(err=>{
        console.log(err)
    })
})

router.put("/like",login,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.User._id}
    },{
        new:true
    }) .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .populate("likes.postedBy","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({err:err})
        }
        else{
            res.json(result)
        }
    })
})


router.put("/unlike",login,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.User._id}
    },{
        new:true
    }) .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name")
    .populate("likes.postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({err:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put("/comment",login,(req,res)=>{
    const comment ={
        text:req.body.text,
        postedBy:req.User._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.postedBy","_id name")
    .populate("postedBy","_id name pic")
    //   .exec((err,result)=>{
    //     if(err){
    //         return res.status(422).json({err:err})
    //     }
    //     else{
    //         res.json(result)
    //     }
    // })
    .then(result=>{
        res.json(result)
    })
})



router.delete("/deletepost/:postId",login,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id pic")
    .exec((err,post)=>{
        console.log("post",post)
        if(err||!post){
            return  res.status(422).json({err:err})
        }
       if(post.postedBy._id.toString() === req.User._id.toString()){
             post.remove()
             .then(result=>{
                 res.json(result)
             }).catch(err=>{

                 console.log(err)
             })
       }
    })
})

router.get("/post/:postId",login,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id pic")
             .then(result=>{
                 res.json(result)
             }).catch(err=>{

                 console.log(err)
             })
       }
    )




router.get("/allpostsofFollowing",login,(req,res)=>{
    Post.find({postedBy:{$in:req.User.following}})
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .populate("likes.postedBy","_id name pic")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
        console.log(posts)
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router