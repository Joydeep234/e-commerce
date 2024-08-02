import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})
const SECRET_KEY = process.env.SECRET;

const getToken = (payload)=>{
    return jwt.sign(
      payload,
      SECRET_KEY,
    );
}

const verifyToken = (req,res,next)=>{
    try {
        const token = req.cookies.UID;
        if(!token)return res.status(402).json({"error":"cookie-expired"})
        
        const verifyUser = jwt.verify(token,SECRET_KEY);
    
        if(!verifyUser)return res.status(402).json({ error: "cookie-expired" });
        req.user = verifyUser
        next()
    } catch (error) {
        console.log("jwt-error", error);
        res.status(401).json({ error: error });
    }
}

export {getToken,verifyToken}