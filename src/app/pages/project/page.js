"use client";

import { useState } from "react";
import { Table, Input, Button, Dropdown, Modal, Form, InputNumber, Select } from "antd";
import { DownOutlined, UploadOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

const { Search } = Input;

const ProjectPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [form] = Form.useForm();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUpload = async (values) => {
    const payload = {
      ...values,
    };
    try {
      const res = await fetch("/api/auth/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        form.resetFields();
        setUploadModalOpen(false);
        window.location.reload();
      } else {
        console.error("Upload failed");
      }
    } catch (err) {
      console.error(err);
    }
  };


  const actionMenuItems = [
    { key: "view", label: "View Project" },
    { key: "edit", label: "Edit Project" },
    { key: "delete", label: "Delete Project" },
  ];

  const columns = [
    { title: "Project Name", dataIndex: "projectName", sorter: (a, b) => a.projectName.localeCompare(b.projectName) },
    { title: "ADL", dataIndex: "adl" },
    { title: "Number of Beneficiaries", dataIndex: "beneficiaries", sorter: (a, b) => a.beneficiaries - b.beneficiaries },
    { title: "Municipality", dataIndex: "municipality" },
    { title: "Uploaded By", dataIndex: "uploadedBy" },
    { title: "Date Uploaded", dataIndex: "dateUploaded" },
    { title: "Progress", dataIndex: "progress" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown menu={{ items: actionMenuItems }}>
          <Button>
            Action <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      projectName: "Livelihood Program",
      adl: "ADL-001",
      beneficiaries: 35,
      municipality: "Tagbilaran",
      uploadedBy: "Admin",
      dateUploaded: "2025-07-20",
      progress: "75%",
      status: "Ongoing",
    },
  ];

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"}`}>
        <div className="flex items-center justify-between p-4">
          {isSidebarOpen && <h2 className="text-lg font-bold">My Dashboard</h2>}
          <button onClick={toggleSidebar} className="text-white hover:text-yellow-300" title="Toggle Menu">
            ☰
          </button>
        </div>
        <nav className="space-y-2 p-4 text-sm">
          <a href="/pages/dashboard" className="block hover:bg-gray-700 p-2 rounded">🏠 {isSidebarOpen && "Dashboard"}</a>
          <a href="/pages/project" className="block hover:bg-gray-700 p-2 rounded bg-gray-700">📁 {isSidebarOpen && "Project"}</a>
          <a href="/pages/verification" className="block hover:bg-gray-700 p-2 rounded">✅ {isSidebarOpen && "Verification"}</a>
          <a href="/pages/verified" className="block hover:bg-gray-700 p-2 rounded">🔒 {isSidebarOpen && "Verified"}</a>
          <a href="/pages/settings" className="block hover:bg-gray-700 p-2 rounded">⚙️ {isSidebarOpen && "Settings"}</a>
        </nav>
      </aside>

      {/* Main Section */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 sticky top-0 z-10 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-green-500">
            TUPAD Profiling and Verification System
          </h1>
          <Button icon={<UploadOutlined />} onClick={() => setUploadModalOpen(true)}>
            Upload Project
          </Button>
        </header>

        <section className="p-6">
          <div className="mb-4">
            <Search
              placeholder="Search Projects"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              style={{ width: 300 }}
            />
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }}
            bordered
          />
        </section>

        <Modal
          open={uploadModalOpen}
          title="Upload New Project"
          onCancel={() => setUploadModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => form.submit()} // Triggers Form onFinish
            >
              Save
            </Button>,
          ]}
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={handleUpload}
            onFinishFailed={(errorInfo) => {
              console.log("Validation Failed:", errorInfo);
            }}
          >
            <Form.Item
              name="projectName"
              label="Project Name"
              rules={[{ required: true, message: "Project Name is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="adl"
              label="ADL"
              rules={[{ required: true, message: "ADL is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="beneficiaries"
              label="Number of Beneficiaries"
              rules={[{ required: true, message: "Number is required" }]}
            >
              <InputNumber className="w-full" />
            </Form.Item>

            <Form.Item
              name="municipality"
              label="Municipality"
              rules={[{ required: true, message: "Municipality is required" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>

      </main>
    </div>
  );
};

export default ProjectPage;
