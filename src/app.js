import express from "express";
import cors from "cors";
const app = express();

app.get("/",(req,res)=>{
    res.send("Hi Buddy!");
});

//basic configuration to take data
app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended : true, limit : "16kb"}));
app.use(express.static("public"));

// cors configuration 
app.use(cors({
    origin : process.env.CORS_ORIGIN?.split(",") || "https://localhost:3000",
    credentials : true,
    methods : ["GET","POST","PUT","PATCH","DELETE"],
    allowedHeaders : ["AUthorization","Content-Type"],
}));


import healthCheckRouter from "./routes/healthcheck.route.js";
import registerUserRouter from "./routes/auth.route.js";
app.use("/api/v1/healthcheck",healthCheckRouter);
app.use("/api/v1/auth",registerUserRouter);

export default app;