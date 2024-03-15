import mongoose from "mongoose";
import { DATABASE } from "@/constants/constants";

if (!DATABASE.uri) {
    throw new Error("No database URL provided");
}

const connectDB = async () => {
    try {
        await mongoose.connect(`${DATABASE.uri}/${DATABASE.db_name}`);

        const db = mongoose.connection;
        db.on("connected", () => {
            console.log("Connected to MongoDB");
        });
        db.on("error", (err) => {
            console.log("Error connecting to MongoDB", err);
            process.exit(1);
        });
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
