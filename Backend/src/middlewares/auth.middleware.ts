import jwt from "jsonwebtoken"
import BlacklistUser from "../models/blacklist.model.js";
import type {Request,Response,NextFunction} from "express";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

async function authUser(req:Request,res:Response,next:NextFunction){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: "Token is not provided"});
    }

    const isTokenBlacklisted = await BlacklistUser.findOne({token});

    if(isTokenBlacklisted){
        return res.status(401).json({message: "Token is blacklisted"});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    } catch(err){
        res.status(401).json({message: "Invalid Token"});
    }
}

export default {authUser}