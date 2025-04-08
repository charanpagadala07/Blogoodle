import { text } from 'express';
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    content:{
        type:String,
    },
    image:{
        type:String,
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            default:[]
        }
    ],
    comments:[
        {
            text:{
                type:String,
                required:true,
            },
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true,
            },
        }
    ]
}, {timestamps:true});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;