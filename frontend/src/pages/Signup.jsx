import { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom'

const Signup = () => {
    const navigate = useNavigate()
  const [input, setinput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showerror,setshowerror] = useState(false)

  useEffect(()=>{
    (async()=>{
        const res = await axios.get("/api/woofers/");
        if(res.status===202)
            navigate("/", { state: { data: res.data } });
    })()
  },[navigate])

  const handleSubmit = async(e) => {
    try {
        e.preventDefault();
        const {name,email,password} = input
    
        if(!name || !email || !password){
            setshowerror(true)
            return
        }else{
            setshowerror(false)
        }
    
        const res = await axios.post("/api/woofers/signup",({
            name,email,password
        }));
        console.log("response is",res);
        navigate('/')
    } catch (error) {
        console.log("signup-error",error);
        alert("try after some time")
    }

  };

  return (
    <>
      <div className="w-full h-screen bg-slate-900 flex justify-center items-center">
        <div className="w-2/4 h-4/6 bg-slate-700 rounded-md flex items-center justify-center">
          <form className="w-full text-center">
            <label className="text-lg text-white m-3 mr-10">Name</label>
            <input
              type="text"
              name="name"
              value={input.name}
              className="w-2/4 h-10 rounded-md my-3 text-center"
              onChange={(e) =>
                setinput({ ...input, [e.target.name]: e.target.value })
              }
            />
            <br />
            <label className="text-lg text-white m-3 mr-11">Email</label>
            <input
              type="email"
              name="email"
              value={input.email}
              className="w-2/4 h-10 rounded-md my-3 text-center"
              onChange={(e) =>
                setinput({ ...input, [e.target.name]: e.target.value })
              }
            />
            <br />
            <label className="text-lg text-white m-3">Password</label>
            <input
              type="password"
              name="password"
              value={input.password}
              className="w-2/4 h-10 rounded-md my-3 text-center"
              onChange={(e) =>
                setinput({ ...input, [e.target.name]: e.target.value })
              }
            />
            <br />
            <div className="h-10">
              {showerror && (
                <div className="px-20 mx-0">
                  <p className="text-red-500">
                    _____________________________________________________________________
                  </p>
                  <p className="text-red-500">please Fill all the Details</p>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-max h-10 rounded-md my-3 text-lg bg-slate-500 px-5 text-white"
              onClick={handleSubmit}
            >
              Signup
            </button><br/>
            <Link to={'/login'} className="text-blue-100 underline">Already have an account? Goto Login</Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
