import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () =>{
    const [backend,setbackend] = useState({});
    const navigate = useNavigate();

    useEffect(()=>{
        // check if user is authenticated 
        fetch("/api/checkUser",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify()
        })
        .then(response=>response.json())
        .then(data=>{
            setbackend(data)
            if(data.auth){
                console.log(data.auth);
                return;
            }
            if(data.status === 401){
                // redirect
                if(window.location.pathname !== "/login"){
                    navigate("/login",{replace:true})
                }
                return;
            }
        })
    },[])
    const handleSubmit =(e)=>{
        e.preventDefault();
            // logout user
            fetch("/api/logout",{
                method:"POST",
                body:JSON.stringify()
            })
            .then(response=>response.json())
            .then(data=>{
                setbackend(data)
                if(data.message === "logout"){
                    navigate("/login",{replace:true})
                }
            })
    }
    return(
        <>
            <h2>welcome {backend && backend.message} </h2>
            <form method="post" onSubmit={handleSubmit}>
            <button type="submit">logout</button>
            </form>
        </>
    )
}

export default Welcome;