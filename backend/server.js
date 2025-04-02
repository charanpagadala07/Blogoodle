import express from "express";

const app = express();

import authRoutes from "./routes/auth.routes.js";

// app.get('/', (req, res)=>{
//     res.send('Server is ready');
// })

app.use(express.json());

app.use("/api/v1/auth", authRoutes);


app.listen(8000, ()=>{
    console.log('Server is running on port localhost:8000');
})