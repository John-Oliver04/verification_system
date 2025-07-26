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
    <header className="bg-white shadow px-6 py-4 sticky top-0 z-10 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-green-500">
        TUPAD Profiling and Verification System
      </h1>

      <Dropdown overlay={menu} trigger={["click"]}>
        <div className="flex items-center space-x-2 cursor-pointer">
          <span className="font-medium text-gray-700">{username}</span>
          <Avatar size="small" icon={<UserOutlined />} />
        </div>
      </Dropdown>
    </header>
  );
};

export default Header;
