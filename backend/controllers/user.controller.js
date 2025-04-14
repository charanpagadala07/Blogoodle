import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({username}).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json(user);        
        
    } catch (error) {
        console.error("Error fetching user profile:", error.stack);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const connectUser = async (req, res) => {
    try {
        const {id} = req.params;
        const UsertoModify = await User.findById(id);
        const currentuser = await User.findById(req.user._id);
        console.log(UsertoModify, currentuser);

        if (id === req.user._id.toString()) {
            return res.status(400).json({
                message: "You cannot connect to yourself",
            });
        }

        if (!UsertoModify || !currentuser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isFollowing = currentuser.following.includes(id);

        if(isFollowing){
            await User.findByIdAndUpdate(req.user._id, {$pull: { following: id }});
            await User.findByIdAndUpdate(id, {$pull: { followers: req.user._id }});
            res.status(200).json({
                message: "Unfollowed successfully",
            });
        } else {
            await User.findByIdAndUpdate(req.user._id, {$push: { following: id }}); 
            await User.findByIdAndUpdate(id, {$push: { followers: req.user._id }});
            const newnotification = new Notification({
                from: req.user._id,
                to: id,
                type: "follow",
            });

            await newnotification.save();

            res.status(200).json({
                message: "Followed successfully",
            });

        }
        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
        
    }

};

export const getsuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const usersfollowedbyme = await User.findById(userId).select('following');

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId },
                },
            },
            {
                $sample: { size: 10 },
            },
        ]);

        const filteredUsers = users.filter(user=>!usersfollowedbyme.following.includes(user._id));

        const suggestedUsers = filteredUsers.slice(0,4);

        suggestedUsers.forEach(user => user.password=null);
        res.status(200).json(suggestedUsers);
        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
        
    }

};

export const updateProfile = async (req, res) => {
    const {username,email, fullname,currentpassword, newpassword, bio, link} = req.body;
    const {profilePic, coverPic} = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message: "User not found",
            });
        }

        if((!newpassword && currentpassword) || (newpassword && !currentpassword)){
            return res.status(400).json({
                message: "Please provide both current and new password",
            });
        }

        if(currenpassword && newpassword){
            const isMatch = await bcrypt.compare(currentpassword, user.password);
            if(!isMatch){
                return res.status(400).json({
                    message: "Current password is incorrect",
                });
            }
            if(newpassword.length < 6){
                return res.status(400).json({
                    message: "New password must be at least 6 characters long",
                });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newpassword, salt);
        }

        if(profilePic){
            if(user.profilePic){
                await cloudinary.uploader.destroy(user.profilePic.split('/').pop().split('.')[0]);
            }
            const result = await cloudinary.uploader.upload(profilePic);
            user.profilePic = result.secure_url;
        }
        if(coverPic){
            if(user.coverPic){
                await cloudinary.uploader.destroy(user.coverPic.split('/').pop().split('.')[0]);
            }
            const result = await cloudinary.uploader.upload(coverPic);
            user.coverPic = result.secure_url;
        }

        user.username = username || user.username;
        user.email = email || user.email;   
        user.fullname = fullname || user.fullname;
        user.bio = bio || user.bio; 
        user.link = link || user.link;

        await user.save();

        user.password = null;

        res.status(200).json({
            user
        });


        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
        
    }

}

