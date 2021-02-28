import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'


const Signup =()=>{
    const history = useHistory()
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)
    const [show,showPass] = useState("password")
    useEffect(()=>{
        if(url){
            uploadfields()
        }
    },[url])

const uploadPic = ()=>{
    const data = new FormData()
    data.append("file",image)
    data.append("upload_preset","Appogram")
    data.append("cloud_name","dpad3bwv8")
    // cloudinay to save images used in application
    fetch("https://api.cloudinary.com/v1_1/dpad3bwv8/image/upload",{
        method:"POST",
        body:data
    }).then(res =>res.json())
    .then(data=>{
        // console.log(data)
        setUrl(data.url)
    }).catch(err=>{
        console.log(err)
    })
}
const uploadfields=()=>{
    // username validation
    if(!/^(?=.*[a-z][a-z\-0-9])(?=.)(?=.{4,})/.test(name)){
        M.toast({html: 'username can contain mininum 4 characters,special characters,numbers,alphabets',classes:"#b71c1c red darken-4"})
        return
    }
    // email validation
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html: 'invalid email',classes:"#b71c1c red darken-4"})
        return
    }
    // password validation
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})/.test(password)){
        M.toast({html: 'password must contain minimum 4 characters , special character ,Number and Capital letter',classes:"#b71c1c red darken-4"})
        return
    }
    // signup 
    fetch("/signup",{
        method:"post",
        headers:{
            "content-Type":"application/json"
        },
        body:JSON.stringify({
            name,
            email,
            password,
            pic:url
        })
    }).then(res=>res.json())
    .then(data=>{
        if(data.errMessage){
            M.toast({html: 'Email already exist',classes:"#b71c1c red darken-4"})
         }
        if(data.error){
            M.toast({html: 'Please enter all the fields',classes:"#b71c1c red darken-4"})
        }
        else{
            M.toast({html:data.message,classes:"#43a047 green darken-1"})
            history.push('/login')
        }
       
    }).catch(err=>{
        console.log(err)
    })
}
// function to submit data with image and without image
const PostData =()=>{
    if(image){
        uploadPic();
    }
    else{
        uploadfields()
    }
}
// for show password toggle 
const pass=()=>{
    showPass(!show)
}


  
return(
    
        <div className="mycard2">
         <div  className="container" style={{flex:'1',backgroundImage:"cover",height:"100%",width:"100%",marginTop:"-10px"}}
         styles={{ backgroundImage:`url(${Image})` }}>
   
        
        {/* <div className="card-image col s16" style={{alignContent:"left"}}>
                
                {/* <img src="https://images.unsplash.com/photo-1516067147809-7724e47963dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60" 
                style={{height:"540px",width:"500px",marginTop:"9px",marginLeft:"120px"}}/>
            </div> */} 
            <div className= "mycard">
            <div className="card auth-card input-field" style={{marginBottom:"-100px"}}>
            <h2 className="h2">Appogram</h2>
            <input type="text"
            placeholder="Username"
            value ={name}
            onChange = {(e)=>setName(e.target.value)}
            />
            <input type="text"
            placeholder="Email"
            value ={email}
            onChange = {(e)=>setEmail(e.target.value)}
            />
            <input type={show? "password":"text"}
            placeholder="Password"
            value ={password}
            onChange = {(e)=>setPassword(e.target.value)}
            />
             <p>
             <label className="showP">
             <input type="checkbox" onClick={() => pass()} />
             <span>Show Password</span>
             </label>
             </p>
            <div className="signup file-field input-field">
                <div className="btn waves-effect waves-light #darkcyan">
                  <span>Upload pic</span>
                  <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className=" btn waves-effect waves-light #26a69a teal lighten-1"
            style={{marginRight:"10px",width:"150px",borderRadius:"5px"}}
            onClick = {()=>PostData()} disabled={!email || !name || !password }>
                Signup
            </button> 
            <p>
               Already have an account?&nbsp;&nbsp;
                <Link to="/login" ><mark style={{color:"darkcyan"}}>Login</mark></Link>
            </p>
            </div>
        </div>
      <footer>
      <div class="container1">
<ul class="foote_bottom_ul_amrc">
<li style={{fontSize:"35px"}}><a href="">Home</a></li>
<li style={{fontSize:"35px"}}><a href="">About</a></li>
<li style={{fontSize:"35px"}}><a href="">Services</a></li>

<li style={{fontSize:"35px"}}><a href="">Blog</a></li>
<li style={{fontSize:"35px"}}><a href="">Contact</a></li>
</ul>

<p class="text-center" style={{textAlign:"center"}}>Copyright @2020 <a href="#">Appogram</a></p>
            </div>
      </footer>
      
      </div>
      </div>
    )
}

export default Signup