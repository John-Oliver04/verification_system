import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EyeSlashIcon,
  Squares2X2Icon,
  EllipsisHorizontalIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";
import Papa from "papaparse";
import { useState, useRef } from "react";
import React from "react";

function Toolbar({ onSearchChange, loading }) {
  const [csvData, setCsvData] = useState([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const csvRef = useRef([]);
  const [formValues, setFormValues] = useState({
    projectName: "",
    adl: "",
    beneficiaries: "",
    municipality: "",
  });

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
        csvRef.current = results.data;
      },
    });
  };

  const handleUpload = async () => {
    try {
      const res = await fetch("/api/auth/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const projectData = await res.json();
      if (!res.ok) throw new Error("Failed to save project");

      const projectId = projectData.project._id;

      if (csvRef.current.length > 0) {
        const normalized = csvRef.current.map((row) => ({
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
          averageMonthlyIncome: parseInt((row["Average Monthly Income"] || "0").replace(/,/g, "")),
          dependent: row["Dependent"] || "",
          notes: row["Notes"] || "",
          stat: "Pending",
          findings: null,
          projectId,
        }));

        await fetch("/api/auth/beneficiary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ beneficiaries: normalized, projectId }),
        });
      }

      setUploadModalOpen(false);
      setCsvData([]);
      csvRef.current = [];
      setFormValues({ projectName: "", adl: "", beneficiaries: "", municipality: "" });
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  const [searchText, setSearchText] = useState("");

  return (
    <div className="flex flex-col gap-2 px-4 py-2 border-b bg-white shadow-sm text-sm font-medium text-gray-700">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => setShowSearch(!showSearch)}>
          <MagnifyingGlassIcon className="w-5 h-5" />
          <span>Search</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer">
          <UserCircleIcon className="w-5 h-5" />
          <span>Person</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer">
          <FunnelIcon className="w-5 h-5" />
          <span>Filter</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer">
          <ArrowsUpDownIcon className="w-5 h-5" />
          <span>Sort</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer">
          <EyeSlashIcon className="w-5 h-5" />
          <span>Hide</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer">
          <Squares2X2Icon className="w-5 h-5" />
          <span>Group by</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer ml-auto text-blue-600" onClick={() => setUploadModalOpen(true)}>
          <ArrowUpOnSquareIcon className="w-5 h-5" />
          <span>Upload</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer">
          <EllipsisHorizontalIcon className="w-5 h-5" />
        </div>
      </div>

      {showSearch && (
        <input
          type="text"
          className="border px-3 py-1 rounded w-full max-w-sm"
          placeholder="Search Projects..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            onSearchChange(e.target.value);
          }}
        />
      )}

    {uploadModalOpen && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 md:p-8 space-y-6 animate-fadeIn">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 text-center">Upload New Project</h2>

            {/* Form Inputs */}
            <div className="space-y-4">
                <input
                type="text"
                placeholder="Project Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formValues.projectName}
                onChange={(e) => setFormValues({ ...formValues, projectName: e.target.value })}
                />
                &nbsp;
                <input
                type="text"
                placeholder="ADL No."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formValues.adl}
                onChange={(e) => setFormValues({ ...formValues, adl: e.target.value })}
                />
                &nbsp;
                <input
                type="number"
                placeholder="No. of Beneficiaries"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formValues.beneficiaries}
                onChange={(e) =>
                    setFormValues({ ...formValues, beneficiaries: e.target.value })
                }
                />
                &nbsp;
                <input
                type="text"
                placeholder="Municipality"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formValues.municipality}
                onChange={(e) =>
                    setFormValues({ ...formValues, municipality: e.target.value })
                }
                />
                &nbsp;
                <input
                type="file"
                accept=".csv"
                className="w-full file:px-4 file:py-2 file:border file:rounded-lg file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition"
                onChange={handleCSVUpload}
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-2">
                <button
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                Cancel
                </button>
                <button
                onClick={handleUpload}
                className="px-4 py-2 my-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                Save
                </button>
            </div>
            </div>
        </div>
    )}

    </div>
  );
}

export default React.memo(Toolbar);