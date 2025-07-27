"use client";

import { DownOutlined, UploadOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Dropdown,
  Modal,
  Form,
  InputNumber,
  Upload,
} from "antd";
import Papa from "papaparse";

const { Search } = Input;

export default function ProjectTable({ projects, loading, handleAction }) {
  const [searchText, setSearchText] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const csvRef = useRef([]);

  const [form] = Form.useForm();

  const handleCSVUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        Papa.parse(e.target.result, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setCsvData(results.data);
            csvRef.current = results.data;
            resolve(false);
          },
          error: (err) => {
            reject(err);
          },
        });
      };
      reader.readAsText(file);
    });
  };

  const handleUpload = async (values) => {
    try {
      const projectRes = await fetch("/api/auth/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const projectData = await projectRes.json();
      if (!projectRes.ok) throw new Error("Failed to save project");

      const projectId = projectData.project._id;

      if (csvRef.current.length > 0) {
        const normalizedBeneficiaries = csvRef.current.map((row) => ({
          firstName: row["First Name"],
          middleName: row["Middle Name"] || "",
          lastName: row["Last Name"],
          extensionName: row["Extension Name"] || "",
          birthdate: new Date(row["Birthdate"]),
          projectLocation: {
            barangay: row["Barangay"] || "",
            cityMunicipality: row["City/Municipality"] || "",
            province: row["Province"] || "",
            district: row["District"] || "",
          },
          typeOfID: row["Type of ID "] || "",
          idNumber: row["ID Number"] || "",
          contactNumber: row["Contact No. "] || "",
          typeOfBeneficiary: row["Type of Beneficiary"] || "",
          occupation: row["Occupation"] || "",
          sex: row["Sex"] === "F" ? "Female" : row["Sex"] === "M" ? "Male" : "",
          civilStatus: row["Civil Status"],
          age: parseInt(row["Age"], 10),
          averageMonthlyIncome: parseInt(
            (row["Average Monthly Income"] || "0").replace(/,/g, "")
          ),
          dependent: row["Dependent"] || "",
          notes: row["Notes"] || "",
          stat: "Pending",
          findings: null,
          projectId,
        }));

        const res = await fetch("/api/auth/beneficiary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            beneficiaries: normalizedBeneficiaries,
            projectId,
          }),
        });

        if (!res.ok) throw new Error("Failed to upload beneficiaries");
      }

      form.resetFields();
      setCsvData([]);
      csvRef.current = [];
      setUploadModalOpen(false);
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  const actionMenuItems = [
    { key: "validate", label: "Validate" },
    { key: "view", label: "View" },
    { key: "edit", label: "Edit" },
    { key: "delete", label: "Delete" },
    { key: "complete", label: "Submit to Admin" },
  ];

  const columns = [
    {
      title: "Project Name",
      dataIndex: "projectName",
      sorter: (a, b) => a.projectName.localeCompare(b.projectName),
    },
    {
      title: "ADL No.",
      dataIndex: "adl",
    },
    {
      title: "No. of Beneficiaries",
      dataIndex: "beneficiaries",
      sorter: (a, b) => a.beneficiaries - b.beneficiaries,
    },
    {
      title: "Municipality",
      dataIndex: "municipality",
    },
    {
      title: "Progress",
      dataIndex: "progress",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: actionMenuItems.map((item) => ({
              ...item,
              onClick: () => handleAction(item.key, record),
            })),
          }}
        >
          <Button>
            Action <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  const filteredData = projects.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <>
      <div className="mb-4 flex justify-between">
        <Search
          placeholder="Search Projects"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          style={{ width: 300 }}
        />

        <Button
          icon={<UploadOutlined />}
          onClick={() => setUploadModalOpen(true)}
        >
          Upload Project
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        bordered
        loading={loading}
      />

      <Modal
        open={uploadModalOpen}
        title="Upload New Project"
        onCancel={() => setUploadModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setUploadModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Save
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleUpload}
          onFinishFailed={(errorInfo) =>
            console.log("Validation Failed:", errorInfo)
          }
        >
          <Form.Item
            name="projectName"
            label="Project Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="adl" label="ADL" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="beneficiaries"
            label="Number of Beneficiaries"
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            name="municipality"
            label="Municipality"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Upload CSV for Beneficiaries">
            <Upload
              accept=".csv"
              beforeUpload={(file) => handleCSVUpload(file)}
            >
              <Button icon={<UploadOutlined />}>Upload CSV</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
