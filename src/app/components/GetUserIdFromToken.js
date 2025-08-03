export async function getUserIdFromToken() {
  try {
    const res = await fetch("/api/auth/user/id", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    return data.userId || null;
  } catch (err) {
    console.error("Failed to get user ID:", err);
    return null;
  }
}
