import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MONGO-DB connected successfully!");
    }catch(error) {
        console.error("MONGO-DB connection error! " , error);
        process.exit(1);
    }
}

export default connectDB;