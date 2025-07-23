import mongoose from "mongoose";


// async function - means the function will run asynchronously 
// (it can pause and wait for something to finish, like connecting to a database, using await).
const connectDB = async()=>{
    console.log("connecting...");
    // Checking if there a connection in MongoDB
    if(mongoose.connections[0].readyState) return

    // Connection the database using the MONGO_URI in my env file
    try {
        await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.MONGO_DB,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error("Failed to connect to MongoDB");
    }
}

export default connectDB;

