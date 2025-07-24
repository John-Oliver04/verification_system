// middleware.js
import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/auth'; // adjust if needed

// Match only routes you want to protect
export const config = {
  matcher: ['/dashboard'],
};

export function middleware(req) {
  const token = req.cookies.get('token')?.value;

  // If no token, redirect to /login
  if (!token) {
    return NextResponse.redirect(new URL('/pages/login', req.url));
  }

  // Optional: You can decode and validate the token here
  // If invalid token, redirect
  try {
    verifyToken(req);
    return NextResponse.next(); // allow access
  } catch (err) {
    return NextResponse.redirect(new URL('/pages/login', req.url));
  }
}
