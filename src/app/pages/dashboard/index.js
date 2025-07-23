// You're importing a helper function called verifyToken.
// This function checks if the request (req) contains a valid token (usually a JWT - JSON Web Token).
// It helps to identify who the user is from their cookie or header.
import { verifyToken } from "@/app/lib/auth";

// This is a Next.js function that runs on the server before showing the page.
    // "req" is the request object (like a package of data from the browser).
    // You pass it to verifyToken to check if the user is logged in.
export async function getServerSideProps({ req }) {

    //    You call the verifyToken function.
    //     If the token is valid, it returns the user info (like user.role).
    //     If invalid, it returns null or undefined. 
    const user = verifyToken(req);

    // If there’s no user (token invalid or missing), they get sent to /login page.
    // permanent: false means it's a temporary redirect (can be changed later).
    if (!user) {
        return {
        redirect: { destination: "/login", permanent: false },
        };
    }

    // If the token is good, Next.js passes the user’s role as a prop to the Dashboard component.
    // So now the Dashboard page knows the user's role.
    return {
        props: { role: user.role },
    };
}

// This is the actual page the user sees.
// It shows a heading and tells the user their role.
export default function Dashboard({ role }) {
    return (
        <div>
        <h1>Dashboard</h1>
        <p>You are logged in as: <strong>{role}</strong></p>
        </div>
    );
}
