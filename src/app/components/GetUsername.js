"use server";

import { cookies } from "next/headers";
import { verifyToken } from "../lib/auth";

export const getUsername = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const user = token ? await verifyToken(token) : null;

  return user?.name || "unknown";
};
