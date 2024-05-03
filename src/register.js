import React, { useState } from "react";
import {useNavigate} from "react-router-dom";

const Register = () =>{
    const navigate = useNavigate();
    // testing api
    const [backenddata,setbackend] = useState();
    // set variables to collect form data
    const [formdata,setFormData] = useState({
        username:"",
        email:"",
        password1:"",
        password2:""
    })

    // handle change on form inputs
    const handleChange = (e) =>{
        const {name,value} = e.target;
        setFormData(prev => ({...prev,[name]:value}))
    }

    // handle how form data is submitted
    const handleSubmit =(e)=>{
        e.preventDefault();
        if(formdata.password1 !== formdata.password2){
            alert("password do not match")
            return;
        }
        fetch("/api/register",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(formdata)
        })
        .then(response=>response.json())
        .then(data=>{
            setbackend(data)
            if(data.message == "ok"){
                navigate("/login")
            }
            if(data.message == "user exist"){
                alert("user exist already change username or email");
                return false;
            }
            
        })
        .catch(err=>console.log(err))
        setFormData({
            username:"",
            email:"",
            password1:"",
            password2:""
        }); 
    }
    return(
        <div>
            <form method="POST" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={formdata.username}
                    placeholder="username"
                    onChange={handleChange}
                    required
                />
                <br/><br/>
                <input
                    type="email"
                    name="email" 
                    value={formdata.email}
                    placeholder="email"
                    onChange={handleChange}
                    required
                />
                <br/><br/>

                <input
                    type="password"
                    name="password1" 
                    value={formdata.password1}
                    placeholder="password"
                    onChange={handleChange}
                    required
                />
                <br/><br/>

                <input
                    type="password"
                    name="password2" 
                    value={formdata.password2}
                    placeholder="confirm password"
                    onChange={handleChange}
                    required
                />
                <br/><br/>

                <button type="submit">register</button>
            </form>
        </div>
    )
}

export default Register