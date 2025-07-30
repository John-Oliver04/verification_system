"use client";

import { useRouter } from "next/navigation"; // Top of component
import { useEffect, useRef, useState } from "react";
import { Input, Button, Dropdown, Form } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import Papa from "papaparse";
import { getUsername } from "@/app/components/GetUsername";
import ProjectTable from "./component/ProjectTable";
import Toolbar from "./component/Toolbar";


const { Search } = Input;

const ProjectPage = ({ user }) => {


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
        <Dropdown
          menu={{
            items: actionMenuItems,
            onClick: ({ key }) => handleAction(key, record),
          }}
          trigger={["click"]}
        >
          <Button>
            Action <DownOutlined />
          </Button>
        </Dropdown>
      ),
    }

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

        <section className="">
          {/* Toolbar */}
          <Toolbar setUploadModalOpen={() => setUploadModalOpen(true)} />


          {/* Project Table */}
          <ProjectTable
            projects={projects}
            loading={loading}
            handleAction={handleAction}
          />

        </section>


      </main>
    </div>
  );
};

export default ProjectPage;
