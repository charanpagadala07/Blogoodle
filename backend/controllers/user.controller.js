import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({username}).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json(user);        
        
    } catch (error) {
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

}