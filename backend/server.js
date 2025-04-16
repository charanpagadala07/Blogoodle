import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import blogRoutes from "./routes/blog.route.js";
import notificationRouters from "./routes/notification.route.js";
import connectDB from "./lib/db.js";


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();


app.use(express.json({limit: "5mb"}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());



app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/notification", notificationRouters);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
  }


app.listen(PORT, ()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectDB();

})