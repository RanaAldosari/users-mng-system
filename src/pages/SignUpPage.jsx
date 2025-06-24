import React ,{useState}from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
function SignUpPage() {
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const navigate=useNavigate()
    // SignUp func
function handelSignUp(){
    if(!email||!password){
        alert("Both fiels are required")
        return
    }else if(!email.includes("@tuwaiq")){
alert("email must be include @tuwaiq.com")
return
    }else if(password.length<3){
alert("password must be more than 3 characters")
return
    }
        axios.post("https://68219a91259dad2655afc3cc.mockapi.io/api/users/user",{
            email,
            password
        })
        .then(()=>{
            alert("account created successfully!")
            navigate("SignIn")
        })
        .catch((err)=>{
            console.log(err)
            alert("There is an error,please try again")
        })
    }
// switch
    function switchSignIn(){
        navigate("/SignIn")
    }
  return (
    <>
<div className="max-w-md mx-auto p-6 rounded-md ">
  <div>
    <label className="text-gray-700 font-semibold mb-2">Email:</label>
    <input
     value={email}
    onChange={(e)=>setEmail(e.target.value)}
      type="email"
      placeholder="Enter your email..."
      className="w-full px-3 py-3 border border-black rounded-md"
    />
  </div>

  <div>
    <label className="text-gray-700 font-semibold mb-2">Password:</label>
    <input
     value={password}
    onChange={(e)=>setPassword(e.target.value)}
      type="password"
      placeholder="Enter your password..."
      className="w-full px-3 py-2 border border-gray-300 rounded-md"
    />
  </div>

  <button
   onClick={handelSignUp}
    className="w-full bg-yellow-200 text-white py-2 rounded-md"
  >
    Create!
  </button>
  <h1>Already you have an account? <span onClick={switchSignIn}>Login</span></h1>
</div>

    </>
  );
}

export default SignUpPage;
