import express from "express";
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectDB();

})