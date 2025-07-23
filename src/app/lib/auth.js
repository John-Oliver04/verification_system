import jwt from "jsonwebtoken";


// It will be used in protected pages or APIs to:"Check if the request has a valid login token"
// It receives req (short for request) — this is the incoming request from the browser.
export function verifyToken(req){

    // This line gets the token stored in the cookie.
    // req.cookies holds all cookies sent from the browser.
    // '?.token safely checks for a cookie named "token".
    const token = req.cookies?.token;

    // If there is no token, the user is not logged in. So the function returns null.
    if (!token) return null;

    //  This block checks if the token is valid and not expired.
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }

}