import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import Blog from "../models/blog.model.js";
import cloudinary from "cloudinary";


export const createBlog = async (req, res) => { 
    const { content } = req.body;
    let { image } = req.body;
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        if (!content && !image) {
            return res.status(400).json({
                message: "Content or image is required",
            });
        }
        if(image){
            const img = await cloudinary.uploader.upload(image);
            image = img.secure_url;
        }
        const newBlog = new Blog({
            user: userId,
            content,
            image,
        });
        await newBlog.save();
        res.status(201).json({
            blog: newBlog
        });
        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
        
    }
}


export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
            });
        }

        if(blog.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this blog",
            });
        }
        if(Blog.image) {
            const imageId = blog.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imageId);
        }
        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Blog deleted successfully",
        });        
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

export const commentOnBlog = async (req, res) => {
    try {
        const { text } = req.body;
        const blogId = req.params.id;
        const userId = req.user._id;
        if(!text){
            return res.status(400).json({message:"Comment is required"});
        }
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
            });
        }
        const comment = {user:userId, text};
        blog.comments.push(comment);
        await blog.save();
        res.status(201).json(comment);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
        
    }


}

export const likeunlikeBlog = async (req, res) => { 
    try {
        const userId = req.user._id;
        const { id: blogId } = req.params;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
            });
        }

        const isLiked = blog.likes.includes(userId.toString());

        if (isLiked) {
            // Unlike the blog
            await Blog.findByIdAndUpdate(blogId, { $pull: { likes: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { likedposts: blogId } });
            return res.status(200).json({
                message: "Blog unliked successfully",
            });
        } else {
            // Like the blog
            await Blog.findByIdAndUpdate(blogId, { $push: { likes: userId } });
            await User.findByIdAndUpdate(userId, { $push: { likedposts: blogId } });
            // Create a notification for the blog owner
            
            const notification = new Notification({
                from: userId,
                to: blog.user,
                type: "like",
            });
            await notification.save();

            return res.status(200).json({
                message: "Blog liked successfully",
            });
        }        
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

export const getallblogs = async (req, res) => {    
    try {
        const blogs = await Blog.find().sort({createdAt:-1}).populate({
            path:'user',
            select:'-password'
        }).populate({
            path:'comments.user',
            select:'-password'
        })

        if(blogs.length === 0) {
            return res.status(404).json({
                message: "No blogs found",
            });
        }

        res.status(200).json(blogs);
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
        
    }

}

export const getlikedblogs = async (req, res) => {  
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const likedposts = await Blog.find({_id: {$in: user.likedposts}}).populate({
            path:'user',
            select:'-password'
        }).populate({
            path:'comments.user',
            select:'-password'  
        });
        res.status(200).json(likedposts);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}


export const followingblogs = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('following');
        if(!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const following = user.following;

        const feedblogs = await Blog.find({user: {$in: following}}).populate({
            path:'user',
            select:'-password'
        }).populate({
            path:'comments.user',
            select:'-password'
        }).sort({createdAt:-1});

        if(feedblogs.length === 0) {
            return res.status(404).json({
                message: "No blogs found",
            });
        }
        res.status(200).json(feedblogs);
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
        
    }

}

export const userBlogs = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const blogs = await Blog.find({user:user._id}).populate({
            path:'user',
            select:'-password'
        }).populate({
            path:'comments.user',
            select:'-password'
        }).sort({createdAt:-1});
        if(blogs.length === 0) {
            return res.status(404).json({
                message: "No blogs found",
            });
        }   

        res.status(200).json(blogs);
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
        
    }

}