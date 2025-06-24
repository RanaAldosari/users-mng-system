import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
function SignInPage() {
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
const navigate=useNavigate()
// signIn func
function handelSignIn(){
// admin account
if(email==="Admin@tuwaiq.com"&&password==="Admin123@tuwaiq"){
alert("login success as admin")
navigate("/Admin")
return
} 
// princple account
if(email==="Princple@tuwaiq.com"&&password==="Princple123@tuwaiq"){
alert("login success as princple")
navigate("/Princple")
return
}
// other users
axios.get("https://68219a91259dad2655afc3cc.mockapi.io/api/users/user")
.then((res)=>{
    const usersData=res.data
    const findUser=usersData.find((user)=>user.email===email&&user.password===password)
if(findUser){
    alert("Login successfully")
// navigate("/users")
} 
else{
    alert("emil or password is not matched")
    return
}
}).catch((err)=>{
    console.log(err)
    alert("there is an error,please try again")
})
}
// switch
    function switchSignUp(){
 navigate("/")
    }
  return (
<>
<div className="max-w-md mx-auto p-6 rounded-md ">
  <div>
    <label className="text-gray-700  mb-2">Email:</label>
    <input
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
      type="email"
      placeholder="Enter your email..."
      className="w-full px-3 py-3 border border-gray-300 rounded-md"
    />
  </div>

  <div>
    <label className="text-gray-700 mb-2">Password:</label>
    <input
    value={password}
    onChange={(e)=>{setPassword(e.target.value)}}
      type="password"
      placeholder="Enter your password..."
      className="w-full px-3 py-3 border border-gray-300 rounded-md"
    />
  </div>

  <button
  onClick={handelSignIn}
    className="w-full bg-yellow-200 text-white py-2 rounded-md"
  >
    Login!
  </button>
  <h1>Don't have an account? <span onClick={switchSignUp}>Create account</span></h1>
</div>
</>
  )
}

export default SignInPage