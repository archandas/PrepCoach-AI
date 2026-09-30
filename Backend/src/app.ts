import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());

//import all the routes
import authRouter from "./routes/authRoutes.js"
import interviewRouter from "./routes/interviewRoutes.js";

//use all the routes
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

export default app;