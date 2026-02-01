import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MONGO-DB connected successfully!");
    }catch{
        console.error("MONGO-DB connection error! " , error);
        exit(1);
    }
}

export default connectDB;