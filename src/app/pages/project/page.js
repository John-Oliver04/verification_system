'use client'

import { useEffect, useState } from "react";
import "antd/dist/reset.css";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import TabControl from "./component/TabControl";

const ProjectPage = () => {

  const [username, setUsername] = useState("loading...");
  useEffect(() => {
    const fetchUsername = async () => {
      const res = await fetch("/api/auth/user");
      const data = await res.json();
      setUsername(data.username);
    };

    fetchUsername();
  }, []);

  return (

    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 flex flex-col text-sm">
        {/* Header */}
        <Header username={username} />

        <section className="">

          {/* Tab Control */}
          <TabControl />

        </section>


      </main>
    </div>
  );
};

export default ProjectPage;
