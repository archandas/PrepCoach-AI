import User from "../models/user.model.js"
import BlacklistUser from "../models/blacklist.model.js";
import type {Request, Response} from "express";
import bcrypt from "../../node_modules/bcryptjs/umd/index.js";
import jwt from "jsonwebtoken"

//handle user registration
async function registerUserController(req:Request,res:Response){
const {username,email,password} = req.body;
if(!username||!email||!password){
    return res.status(400).json({ message:"enter username, email and password"});
}

const isUserAlreadyExist = await User.findOne({
    $or: [{username},{email}]
})

//check if the user already exists
if(isUserAlreadyExist){
    return res.status(400).json({
        message: "account already exist with this username or email"
    });
}

//password is hashed here
const hash = await bcrypt.hash(password,10);

//creates new users
const user = await User.create({
    username,
    email,
    password: hash
})

const token = jwt.sign(
    {id:user._id, username:user.username},
    process.env.JWT_SECRET!,
    {expiresIn: "1d"}
)

res.cookie("token",token);

res.status(201).json({
    message: "user registered successfully",
    user: {
        id: user._id,
        username: user.username,
        email: user.email
    }
});
}

//handle user login
async function loginUserController(req:Request,res:Response){
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "please enter email and password"});
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({message: "Invalid email or password"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({message: "Invalid email or password"});
    }

    const token = jwt.sign(
        {id:user._id, username:user.username},
        process.env.JWT_SECRET!,
        {expiresIn: "1d"}
    );

    res.cookie("token",token);

    res.status(200).json({
        message: "user logged in successfully",
        user: {
            id: user._id,
            email: user.email,
            password: user.password
        }
    });
}

//handle user logout
async function logoutUserController(req:Request,res:Response){
    const token = req.cookies.token;

    if(token){
        await BlacklistUser.create({token});
    }

    res.clearCookie("token");
    res.status(200).json({message: "user logged out successfully"});
}

//handle user get-me
async function getMeController(req:Request,res:Response){
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
        user: {
            id: user?._id,
            username: user?.username,
            email: user?.email
        }
    })
}
export default {registerUserController, loginUserController, logoutUserController, getMeController}