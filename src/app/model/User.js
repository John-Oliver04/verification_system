import mongoose from "mongoose";

// Think of it like a blueprint for users in your database. 
// It tells MongoDB: “Every user should have a username, email, password, and role.”
const userSchema = new mongoose.Schema(
    {
        username: String,
        email: {
            type: String,
            unique: true
        },
        password: String,
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    }
);

export default mongoose.models.User || mongoose.model("User",userSchema)