import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.get("/",(req,res)=>{
    res.send("Hi Buddy!");
});

//basic configuration to take data
app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended : true, limit : "16kb"}));
app.use(express.static("public"));

//cookie-configure
app.use(cookieParser());

// cors configuration 
app.use(cors({
    origin : process.env.CORS_ORIGIN?.split(",") || "https://localhost:3000",
    credentials : true,
    methods : ["GET","POST","PUT","PATCH","DELETE"],
    allowedHeaders : ["Authorization","Content-Type"],
}));


import healthCheckRouter from "./routes/healthcheck.route.js";
import registerUserRouter from "./routes/auth.route.js";
import projectRouter from "./routes/project.route.js";
import taskRouter from "./routes/task.route.js";

app.use("/api/v1/healthcheck",healthCheckRouter);
app.use("/api/v1/auth",registerUserRouter);
app.use("/api/v1/project",projectRouter);
app.use("/api/v1/tasks",taskRouter);

export default app;