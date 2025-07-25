import React from 'react'
import { useState } from 'react';


const Sidebar = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

  return ( 
    <aside className={`bg-gray-800 text-white transition-all duration-300 ${ isSidebarOpen ? "w-64" : "w-16" }`}>
        <div className="flex items-center justify-between p-4">
            {isSidebarOpen && <h2 className="text-lg font-bold">Dashboard</h2>}
            <button  onClick={toggleSidebar} className="text-white hover:text-yellow-300"  title="Toggle Menu"  >   ☰  </button>
        </div>
        <nav className="space-y-2 p-4 text-sm">
            <a href="/pages/dashboard" className="block hover:bg-gray-700 p-2 rounded">
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
  )
}

export default Sidebar