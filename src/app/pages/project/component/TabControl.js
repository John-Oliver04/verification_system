"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Toolbar from "./Toolbar";
import ProjectTable from "./ProjectTable";
import { Form, Input } from "antd";
import Papa from "papaparse";
import useDebouncedValue from "@/app/lib/useDebouncedValue";
import { getUserIdFromToken } from "@/app/components/GetUserIdFromToken";
import KanbanView from "./KanbanView";

export default function TabControl() {
  const [projects, setProjects] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [csvData, setCsvData] = useState([]);
  const csvRef = useRef([]);

  const [userId, setUserId] = useState(null);
  const router = useRouter();

  const [form] = Form.useForm();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserIdFromToken();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const handleAction = useCallback((actionKey, record) => {
    if (actionKey === "validate") {
      router.push(`/pages/verification?projectId=${record.key}`);
    } else if (actionKey === "view") {
      console.log("Viewing project:", record.projectName);
    }
  }, [router]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/auth/project/usersproject");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      const formatted = data.map((item) => ({ key: item._id, ...item }));
      setProjects(formatted);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      console.log("👤 userId available:", userId);
      fetchProjects();
    }
  }, [userId]);

  useEffect(() => {
    const MYPROJECTS = searchText.trim()
      ? projects.filter((p) =>
          p.projectName.toLowerCase().includes(searchText.toLowerCase())
        )
      : projects;
    setFilteredData(MYPROJECTS);
  }, [projects, searchText]);

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
            console.error("CSV parsing failed", err);
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
        function parseAverageIncome(incomeStr) {
          if (!incomeStr) return 0;
          const parts = incomeStr.replace(/,/g, "").split("-");
          const nums = parts.map((n) => parseInt(n.trim(), 10)).filter((n) => !isNaN(n));
          if (nums.length === 2) {
            return Math.round((nums[0] + nums[1]) / 2);
          }
          return nums[0] || 0;
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
          stat: "Pending",
          findings: null,
          projectId,
          uploader: userId,
        }));

        const res = await fetch("/api/auth/beneficiary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ beneficiaries: normalizedBeneficiaries, projectId }),
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

  // TABS
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("table");
  const [newTabCount, setNewTabCount] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Add "table" tab once on mount
    setTabs((prev) => {
      if (prev.some((t) => t.key === "table")) return prev;
      return [
        {
          key: "table",
          label: "Table Tab",
          fixed: true,
        },
        ...prev,
      ];
    });
  }, []);

  const addStatusTab = () => {
    const key = `status-${newTabCount}`;
    setTabs((prevTabs) => [
      ...prevTabs,
      { key, label: `Status View ${newTabCount}`,  content: <KanbanView projects={filteredData} /> },
    ]);
    setActiveTab(key);
    setNewTabCount((count) => count + 1);
    setShowDropdown(false);
  };

  const removeTab = (key) => {
    const filtered = tabs.filter((tab) => tab.key !== key);
    setTabs(filtered);
    if (activeTab === key) {
      setActiveTab(filtered[0]?.key || "table");
    }
  };

  return (
    <div className="p-4">
      <div className="flex space-x-2 border-b border-blue-300 pb-1 relative">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`px-4 py-2 cursor-pointer rounded-t ${activeTab === tab.key ? "bg-white border border-b-0 border-blue-500" : "bg-gray-200"}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <div className="flex items-center space-x-2">
              <span>{tab.label}</span>
              {!tab.fixed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(tab.key);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ✖
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            +
          </button>

          {showDropdown && (
            <div className="absolute z-10 top-10 right-0 bg-white border-blue-500 rounded shadow-md w-40">
              <button
                onClick={addStatusTab}
                className="w-full px-4 py-2 text-left hover:bg-blue-100"
              >
                ➕ Add Status View
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 p-2 rounded bg-white shadow">
        {activeTab === "table" ? (
          <div className="space-y-4">
            <Toolbar onSearchChange={setSearchText} loading={loading} />
            <ProjectTable
              projects={filteredData}
              loading={loading}
              handleAction={handleAction}
            />
          </div>
        ) : (
          tabs.find((tab) => tab.key === activeTab)?.content || "No content"
        )}
      </div>
    </div>
  );
}
