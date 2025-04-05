import express from "express";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

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