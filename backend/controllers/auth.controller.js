import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenandSetCookie } from "../lib/utils/generateToken.js";

export const signup = async ( req, res) =>{
    console.log(req.body);
    try {
        const {username, fullname, email, password} = req.body;
        if(!username || !fullname || !email || !password){
            return res.status(400).json({
                message: "All fields are required",
            })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                message: "Email is not valid",
            })
        }

        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({
                message: "Username already exists",
            })
        }
        const existingemail = await User.findOne({email});
        if(existingemail){
            return res.status(400).json({
                message: "Email already exists",
            })
        }
        if(password < 6){
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            fullname,
            email,
            password: hashedPassword,
        });

        if(newUser){
            generateTokenandSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            });

        } else {
            res.status(400).json({
                message: "Invalid user data",
            });

        }

       
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        })
        
    }
};


export const login = async (req, res) =>{
    try {
        const {username, password} = req.body;
        if(!username || !password){
            return res.status(400).json({
                message: "All fields are required",
            })
        }

        const user = await User.findOne({username});
        const ispasswordcorrect = await bcrypt.compare(password, user?.password || "");
        if(!user || !ispasswordcorrect){
            return res.status(400).json({
                message: "Invalid credentials",
            })
        };

        generateTokenandSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });
        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        })        
    }
};

export const logout = (req, res) =>{
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({
            message: "Logged out successfully",
        });
        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        })
        
    }
}

export const getme = async (req, res) =>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        })

    }
}