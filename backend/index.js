const express = require("express");
const argon2 = require("argon2");
const bodyParser = require("body-parser");
const conn = require("./dbconnect");
const session = require("express-session");
const {validate_user} = require("./middleware/validation");
const { body } = require("express-validator");
const app = express();

app.use(bodyParser.json());

app.use(session({
    secret:"my-secret-key",
    resave:false,
    saveUninitialized:true
}))

// register api
app.post("/api/register",[
    body("username")
    .trim()
    .isAlpha().withMessage("letters only")
    .isLength({min:3}).withMessage("more than 3 letters please"),
    body("email").isEmail().withMessage("enter valid email"),
    body("password1").isLength({min:6}).withMessage("enter more than 6 characters")
],validate_user,(req,res)=>{
    try {
        // fetch data from frontend
        const {username, email, password1} = req.body;

        // check if user exists
        const checkSQL = "SELECT * FROM users WHERE username = ? OR email = ?";
        conn.query(checkSQL,[username,email],async (error,results)=>{
            if(error){
                res.json({message:"Server error"})
                return;
            }
            if(results.length>0){
                res.json({message:"user exist"})
                return false;
            }
            try{    
            // user does not exist proceed with registration
            const hashpass = await argon2.hash(password1);

            // create sql query
            const sql = "INSERT INTO users (username,email,password) VALUES(?,?,?)";
            conn.query(sql,[username,email,hashpass],(error,results)=>{
                if(error){
                    console.log("failed to resister user",error)
                }else{
                    res.json({message:"ok"})
                }
            });
        }
        catch(err){
            console.log(err);
        }
        })
    } catch (error) {
        console.log(error)
    }
})

// login api

app.post("/api/login",(req,res)=>{
    // get values from front end
    const {username,password} = req.body;

    // validate with data from database
    const sql = "SELECT * FROM users WHERE username = ?";

    try{
        conn.query(sql,[username],async(error,results)=>{
            if(error){
                res.json({message:"server error"})
            }
            if(results.length == 0){
                res.json({message:"user not found"})
                return;
            }
            try{
                const checkPassword = await argon2.verify(results[0].password,password);
                if(checkPassword){
                    // log user in assign sessions and redirect user
                    req.session.user = username;
                    res.json({message:"ok",userSession:req.session.user})
                }else{
                    res.json({message:"wrongPass"})
                }
            }
            catch(err){
                console.log(err);
            }

        })
    }
    catch(e){
        console.log(e);
    }

})

app.post("/api/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log("error destroying session")
        }else{
            res.json({message:"logout"})
        }
    })
})

app.post("/api/checkUser",(req,res)=>{
    if(req.session.user){
        res.status(200).json({message:req.session.user, auth:true})
    }
    if(!req.session.user){
        res.status(401).json({status:401, auth:false})
    }
})
app.listen(8080);
