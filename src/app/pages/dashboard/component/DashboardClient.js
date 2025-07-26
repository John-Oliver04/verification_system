'use client'


import {  useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from "recharts"; 
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";

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


export default function DashboardClient({user}) {

  const [role, setRole] = useState(user?.role || "unknown");
  const [username] = useState(user?.name || "unknnown");


 
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar/>

      {/* Main Section */}
      <main className="flex-1 flex flex-col overflow-y-auto max-h-screen">
        
        {/* Header */}
        <Header username={username}/>

        <section className="p-6">
          <h2 className="text-xl font-bold mb-2">👋 Welcome to Dashboard!</h2>
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
