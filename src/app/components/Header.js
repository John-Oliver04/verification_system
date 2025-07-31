// components/Header.jsx
'use client'

import React from 'react';
import { Dropdown, Avatar, Menu } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const Header = ({ username }) => {

  const router = useRouter();


  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
<header className="bg-white shadow px-6 sticky top-0 z-10 h-16 flex items-center justify-between">
  {/* Title */}
  <div className="flex-1 flex items-center">
    <h1 className="text-4xl pt-5 font-semibold text-gray-800">
      TUPAD Profiling and Verification System
    </h1>
  </div>

  {/* User Dropdown */}
  <Dropdown overlay={menu} trigger={["click"]}>
    <div className="flex items-center gap-2 cursor-pointer">
      <span className="font-medium text-gray-700 leading-none">{username}</span>
      <Avatar size={32} icon={<UserOutlined />} />
    </div>
  </Dropdown>
</header>



  );
};

export default Header;
