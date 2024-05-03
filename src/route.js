import {BrowserRouter,Routes,Route,Link} from "react-router-dom";
import Register from "./register";
import Login from "./login";
import Welcome from "./welcome";

const Routing = ()=>{
    return(
        <BrowserRouter>
            <Link to="register">Register</Link>
            <Link to="login">Login</Link>
            <br/> <br/>

            <Routes>
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />}/>
                <Route path="welcome" element={<Welcome />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Routing