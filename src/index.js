import dotenv, { config } from "dotenv";
import app from "./app.js";
import connectDB from "./db/db-connection.js";
dotenv.config({
    path : "./.env",
});


const port = process.env.PORT;


connectDB()
    .then(()=>{
        app.listen(port , () => {
            console.log(`app listening on the port : http://localhost:${port}`);
        });
    })
    .catch( (error) => {
        console.error("MongoDB connection error", error);
        process.exit(1);
    })