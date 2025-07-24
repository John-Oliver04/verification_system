import { NextResponse } from 'next/server';

// This brings in bcryptjs, a tool that encrypts passwords (called hashing).
import bcrypt from "bcryptjs";

// to import the db.js, To use
import connectDB from "@/app/lib/db";

// importing the blueprint you made earlier for storing users (username, email, password, role).
import User from "@/app/model/User";

// This is your API route.
// It will run whenever someone sends a POST request (like from a signup form).
export async function POST(req, res){

    console.log("saving data...")
    try{
        // make the request is in json format
        const body = await req.json(); 

        // This says: “Only allow POST requests.”
        // If someone sends a GET or PUT, it returns 405 – Method Not Allowed.
        if (req.method !== "POST") return res.status(405).end();

        // This gets the data the user sent from the signup form.
        const {username, email, password, role} = body;

        // This connects to the MongoDB database so you can save data.
        await connectDB();

        // if the email inputed is existing
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
        }

        // make the password encrypted before saving it to database;
        const hashedPassword = await bcrypt.hash(password,10);

        // This creates a new user object using your schema.
        const newUser = new User(
            {
                username,
                email,
                password: hashedPassword,
                role
            }
        );


        // This saves the user into your database.
        await newUser.save();

        // Status 201 means “created successfully”.
        // Sends back a success message in JSON format.
        return NextResponse.json({ message: "User created" });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }

}

