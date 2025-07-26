"use client";

import { useRouter } from "next/navigation"; // Top of component
import { useEffect, useRef, useState } from "react";
import { Table, Input, Button, Dropdown, Modal, Form, InputNumber, Upload } from "antd";
import { DownOutlined, UploadOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import Papa from "papaparse";
import { getUsername } from "@/app/components/GetUsername";
import jwt from "jsonwebtoken";
import Unauthorized401 from "@/app/components/Unauthorized401";


const { Search } = Input;

const ProjectPage = ({ user }) => {
  
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const getTokenFromCookie = () => {
      const match = document.cookie.match(/(^| )token=([^;]+)/);
      return match ? match[2] : null;
    };

    const token = getTokenFromCookie();

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        setUserToken(decoded);
      } catch (err) {
        console.error("Invalid token", err);
        setUserToken(null);
      }
    } else {
      setUserToken(null);
    }
  }, []);

  if (userToken === null) {
    return <Unauthorized401 />;
  }


  const [form] = Form.useForm();
  const [csvData, setCsvData] = useState([]);
  const csvRef = useRef([]); // <--- Fix: keep latest csvData between re-renders

  // get user ID
  const [userId] = useState(user?._id || "unknown");
  // get username
  const [username, setUsername] = useState("loading...");
  useEffect(() => {
    const fetchUsername = async () => {
      const name = await getUsername();  // no param needed
      setUsername(name);
    };
    fetchUsername();
  }, []);





  const [searchText, setSearchText] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter(); // Inside component  

  const handleAction = (actionKey, record) => {
  if (actionKey === "validate") {
      // Redirect with projectId as query parameter
      router.push(`/pages/verification?projectId=${record.key}`);
    }

    // Optional: Handle other actions like view, edit, etc.
    else if (actionKey === "view") {
      console.log("Viewing project:", record.projectName);
    }
  };



  // ✅ Handle CSV Upload
  const handleCSVUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        Papa.parse(e.target.result, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log("Parsed CSV:", results.data);
            setCsvData(results.data); // Update state
            csvRef.current = results.data; // ✅ Also update ref
            resolve(false); // Prevent default upload
          },
          error: (err) => {
            console.error("CSV parsing failed", err);
            reject(err);
          },
        });
      };
      reader.readAsText(file);
    });
  };

  // ✅ Upload New Project
  const handleUpload = async (values) => {
    try {
      // Step 1: Save Project
      const projectRes = await fetch("/api/auth/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const projectData = await projectRes.json();
      if (!projectRes.ok) throw new Error("Failed to save project");

      const projectId = projectData.project._id;

      // Step 2: Save Beneficiaries
      console.log("✅ CSV Rows Detected:", csvRef.current.length);
      if (csvRef.current.length > 0) {

      function parseAverageIncome(incomeStr) {
        if (!incomeStr) return 0;
        // Remove commas and split on dash
        const parts = incomeStr.replace(/,/g, "").split("-");
        const nums = parts.map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
        if (nums.length === 2) {
          return Math.round((nums[0] + nums[1]) / 2);
        }
        return nums[0] || 0; // fallback to single number
      }

        const normalizedBeneficiaries = csvData.map((row) => ({
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

          averageMonthlyIncome: parseAverageIncome(row["Average Monthly Income"]),
          dependent: row["Dependent"] || "",

          notes: row["Notes"] || "",

          stat: "Pending", // default or set from CSV if needed
          findings: null,  // or use a value like "" if preferred

          projectId,
          uploader: userId,
        }));

        const res = await fetch("/api/auth/beneficiary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            beneficiaries: normalizedBeneficiaries,
            projectId,
          }),
        });

        const result = await res.json();
        if (!res.ok) {
          console.error("❌ Upload failed:", result.message);
          throw new Error("Failed to save beneficiaries");
        }

        console.log("✅ Beneficiaries uploaded:", result.message);
      } else {
        console.warn("⚠️ No CSV data to upload.");
      }

      form.resetFields();
      setCsvData([]);
      csvRef.current = [];
      setUploadModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };



  // ✅ Fetch Projects
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/auth/project");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      const formatted = data.map((item) => ({
        key: item._id,
        ...item,
      }));
      setProjects(formatted);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const actionMenuItems = [
    { key: "validate", label: "Validate" },
    { key: "view", label: "View" },
    { key: "edit", label: "Edit" },
    { key: "delete", label: "Delete" },
    { key: "complete", label: "Submit to Admin" },
  ];

  const columns = [
    { title: "Project Name", dataIndex: "projectName", sorter: (a, b) => a.projectName.localeCompare(b.projectName) },
    { title: "ADL No.", dataIndex: "adl" },
    { title: "No. of Beneficiaries", dataIndex: "beneficiaries", sorter: (a, b) => a.beneficiaries - b.beneficiaries },
    { title: "Municipality", dataIndex: "municipality" },
    // { title: "Uploaded By", dataIndex: "uploadedBy" },
    // { title: "Date Uploaded", dataIndex: "dateUploaded" },
    { title: "Progress", dataIndex: "progress" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown menu={{
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

    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 flex flex-col text-sm">
        {/* Header */}
        <Header username={username} />

        <section className="p-6">
           {/* Top Panel for Additional Components */}
          <div className="bg-gray-100 p-4 mb-4 rounded shadow flex justify-between items-center">
            <div className="font-semibold text-gray-700">📌 TUPAD Projects Panel</div>
            {/* You can place buttons or summaries here */}
            <div>
              <Button type="link">Stats</Button>
              <Button type="link">Recent Uploads</Button>
              <Button type="link">Export</Button>
            </div>
          </div>

          {/* Search bar */}
          <div className="mb-4 flex justify-between">
            <Search
              placeholder="Search Projects"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              style={{ width: 300 }}
            />
            <Button icon={<UploadOutlined />} onClick={() => setUploadModalOpen(true)}>
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
        </section>

        <Modal
          open={uploadModalOpen}
          title="Upload New Project"
          onCancel={() => setUploadModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setUploadModalOpen(false)}>Cancel</Button>,
            <Button key="submit" type="primary" onClick={() => form.submit()}>Save</Button>,
          ]}
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={handleUpload}
            onFinishFailed={(errorInfo) => console.log("Validation Failed:", errorInfo)}
          >
            <Form.Item name="projectName" label="Project Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="adl" label="ADL" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="beneficiaries" label="Number of Beneficiaries" rules={[{ required: true }]}>
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item name="municipality" label="Municipality" rules={[{ required: true }]}>
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
      </main>
    </div>
  );
};

export default ProjectPage;
