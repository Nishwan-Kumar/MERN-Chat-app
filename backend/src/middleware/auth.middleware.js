import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized - No token Provided"})
        }

        const decrypt = jwt.verify(token,process.env.JWT_SECRET)
        if(!decrypt){
            return res.status(401).json({message:"Unauthorized - Invalid Token"})
        }
        
        const user = await User.findById(decrypt.userId).select("-password")
        if(!user){
            return res.status(401).json({message:"User Not found"})
        }
        req.user = user
        next()
    }catch(err){
        console.log("Error in Protected Route middleware"+err.message)
        res.status(500).json({message:"Internal Server Error"});
    }
}