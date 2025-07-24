
import { cookies } from "next/headers";       
import { verifyToken } from "@/app/lib/auth"; 
import DashboardClient from "./component/DashboardClient";

export default function DashboardPage() {
 const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  const user = token ? verifyToken(token) : null;

  return <DashboardClient user={user} />;
}
