import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authorize = async ( req, res, next) => {
    try {

        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({
                message: "Unauthorized : no token provided",
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({
                message: "Unauthorized",
            })
        }

        const user = await User.findById(decode.userId).select("-password");
        if(!user){
            return res.status(404).json({
                message: "User not found",
            })
        }

        req.user = user;
        next();
        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
        
    }
}