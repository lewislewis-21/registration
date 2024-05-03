import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

const Login = () =>{
    const [backend,setbackend] = useState();
    const navigate = useNavigate();
    const [logindata,setlogindata] = useState({
        username:"",
        password:""
    })

    const handleChange = (e) =>{
        const {name,value} = e.target;
        setlogindata(prev =>({...prev,[name]:value}));
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        fetch("/api/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(logindata)
        })
        .then(response=>response.json())
        .then(data=>{
            setbackend(data)
            if(data.message == "ok"){
            navigate("/welcome")
            setlogindata({
                username:"",
                password:""
            })
            }
            if(data.message == "user not found"){
                alert("user not found")
            }
            if(data.message == "wrongPass"){
                alert("wrong password")
            }
        })
        
    }
    return(
        <div>
            <form method="POST" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={logindata.username}
                    placeholder="username"
                    onChange={handleChange}
                />
                <br/><br/>
                <input
                    type="password"
                    name="password" 
                    value={logindata.password}
                    placeholder="password"
                    onChange={handleChange}
                />
                <br/><br/>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default Login;