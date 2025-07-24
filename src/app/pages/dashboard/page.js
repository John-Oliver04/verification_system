"use client";

import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";

// Sample static data (replace with real API later)
const genderData = [
  { name: "Male", value: 120 },
  { name: "Female", value: 100 },
];

const projectMonthlyData = [
  { month: "Jan", count: 5 },
  { month: "Feb", count: 10 },
  { month: "Mar", count: 7 },
  { month: "Apr", count: 15 },
  { month: "May", count: 12 },
];

const beneficiariesMonthlyData = [
  { month: "Jan", total: 50 },
  { month: "Feb", total: 80 },
  { month: "Mar", total: 65 },
  { month: "Apr", total: 100 },
  { month: "May", total: 90 },
];

const totalData = [
  { name: "Beneficiaries", value: 400 },
  { name: "Projects", value: 25 },
];

const indigenousData = [
  { name: "Indigenous", value: 70 },
  { name: "Non-Indigenous", value: 330 },
];

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [role, setRole] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setRole(data.role);
        } else {
          setRole("Unknown");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setRole("Unknown");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          {isSidebarOpen && <h2 className="text-lg font-bold">My Dashboard</h2>}
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-yellow-300"
            title="Toggle Menu"
          >
            ☰
          </button>
        </div>
        <nav className="space-y-2 p-4 text-sm">
          <a href="/pages/dashboard" className="block hover:bg-gray-700 p-2 rounded bg-gray-700">
            🏠 {isSidebarOpen && "Dashboard"}
          </a>
          <a href="/pages/project" className="block hover:bg-gray-700 p-2 rounded">
            📁 {isSidebarOpen && "Project"}
          </a>
          <a href="/pages/verification" className="block hover:bg-gray-700 p-2 rounded">
            ✅ {isSidebarOpen && "Verification"}
          </a>
          <a href="/pages/verified" className="block hover:bg-gray-700 p-2 rounded">
            🔒 {isSidebarOpen && "Verified"}
          </a>
          <a href="/pages/settings" className="block hover:bg-gray-700 p-2 rounded">
            ⚙️ {isSidebarOpen && "Settings"}
          </a>
        </nav>
      </aside>

      {/* Main Section */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 sticky top-0 z-10 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-green-500">TUPAD Profiling and Verification System</h1>
        </header>

        <section className="p-6">
          <h2 className="text-xl font-bold mb-2">👋 Welcome to your Dashboard!</h2>
          <p className="text-gray-600 mb-2">
            Your role: <strong>{role || "Loading..."}</strong>
          </p>
          <p className="text-gray-500 text-sm mb-4">
            This page is protected and only visible to logged-in users.
          </p>

          {/* Graphs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Gender Distribution Pie Chart */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold mb-2 text-center">Total Male vs Female</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={80}>
                    {genderData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Projects Line Chart */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold mb-2 text-center">Uploaded Projects per Month</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={projectMonthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Beneficiaries */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold mb-2 text-center">Beneficiaries per Month</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={beneficiariesMonthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Total Count Pie */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold mb-2 text-center">Total Summary</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={totalData} dataKey="value" nameKey="name" outerRadius={80}>
                    {totalData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Indigenous Pie Chart */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold mb-2 text-center">Indigenous Beneficiaries</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={indigenousData} dataKey="value" nameKey="name" outerRadius={80}>
                    {indigenousData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
