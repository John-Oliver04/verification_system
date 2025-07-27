
import { cookies } from "next/headers";       
import { verifyToken } from "@/app/lib/auth"; 
import DashboardClient from "./component/DashboardClient";
import Unauthorized401 from "@/app/components/Unauthorized401";

export default async function DashboardPage() {
 const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = token ? verifyToken(token) : null;

    // If no valid user, show 401 page
  if (!user) {
    return <Unauthorized401 />;
  }

  return <DashboardClient user={user} />;
}
