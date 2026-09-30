import mongoose from "mongoose";

async function connectDB() {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
        throw new Error("MONGO_URI is not defined");
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log("DB is connected");
    } catch (err) {
        console.error(err);
    }
}

export default connectDB;