import React,{useState,useContext, useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import FacebookLogin from 'react-facebook-login';
import axios from 'axios'
import {UserContext} from '../App'

const Login =()=>{
    const {dispatch} = useContext(UserContext)
    const history = useHistory()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [show,showPass] = useState("password")

    // validation for input field
    const PostData =()=>{
        
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
      
        // login api
        fetch("/login",{
            method:"post",
            headers:{
                "content-Type":"application/json",
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            
            if(data.error){
               M.toast({html: 'Invalid email/password',classes:"#b71c1c red darken-4"})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:"data.user"})
                M.toast({html:"signed in successfully",classes:"#43a047 green darken-1"})
                history.push('/')
                window.location.reload(true)
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    
    // Facebook login
    const responseFacebook=(response)=>{
        console.log(response)
        axios({
            method:"post",
            url:"http://localhost:5000/facebookLogin",
            data:{accessToken:response.accessToken,userID:response.userID}
        }).then(response =>{
            localStorage.setItem("jwt",response.data.token)
            localStorage.setItem("user",JSON.stringify(response.data.user))
            dispatch({type:"USER",payload:"response.data.user"})
            console.log("facebook login success",response)
            M.toast({html:"signed in successfully",classes:"#43a047 green darken-1"})
                history.push('/')
                window.location.reload(true)

        }).catch(error => {
            console.log(error.response)
        });
    }
    // show password toggle
    const pass=()=>{
        showPass(!show)
    }
    return(
       
    <div className="mycard2">
        <div id="fb-root"></div>
        <script async defer crossorigin="anonymous"  
        style={{marginLeft:"30px"}} 
        src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v7.0&appId=1180841995600946&autoLogAppEvents=1" 
        nonce="PDmfefqu">
        </script>
        <div  className="container" style={{flex:'1',backgroundImage:"cover",height:"100%",width:"100%",marginTop:"-10px"}}
         styles={{ backgroundImage:`url(${Image})` }}>
   
            <div className= "mycard">
            <div className="card auth-card input-field">
           <h2 className="h2">Appogram</h2>
            <input type="text"
            placeholder="Email"
            value ={email}
            onChange = {(e)=>setEmail(e.target.value)}
            />
            <input type={show?"password":"text"}
            placeholder="Password"
            value ={password}
            onChange = {(e)=>setPassword(e.target.value)}
            />
            <p>
             <label style={{float:"left"}}>
             <input type="checkbox" onClick={()=>pass()} />
             <span>Show password</span>
             </label>
             </p>
             <button className="login btn waves-effect waves-light #darkcyan"
            onClick = {()=>PostData()} disabled={!email  || !password }>&nbsp;&nbsp;
                Login
            </button>
            <p>
                Dont have an account?&nbsp;&nbsp;
                <Link to="/signup"><mark style={{color:"darkcyan"}}>Signup</mark></Link>
            </p>
            <p>
                <Link to="/reset"><mark style={{color:"darkcyan"}}>Forgot Password?</mark></Link>
            </p>
            {/* for facebook button */}
            <p className="hh">or</p>
            <FacebookLogin
             appId="1180841995600946"
             autoLoad={false}
             disableMobileRedirect={true}
             icon="fa fa-facebook-square  &nbsp;&nbsp;"
             cssClass=" my-facebook-button-class"
             callback={responseFacebook}
             
             />
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

export default Login