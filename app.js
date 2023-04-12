import express from "express";
import {config} from "dotenv";
import course from "./routes/courseRoutes.js"
import user from "./routes/userRoutes.js"
import ErrorMiddleware from "./middlewares/Error.js"
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

config({
    path:"./config/config.env"
})
app.use(cookieParser());

app.use("/api/v1",course);
app.use("/api/v1",user);

export default app;

app.use(ErrorMiddleware);