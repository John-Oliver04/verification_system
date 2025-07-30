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

export default function Toolbar({ onSearchChange, loading, onUploadClick }) {

     const [csvData, setCsvData] = useState([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
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
          averageMonthlyIncome: parseInt(
            (row["Average Monthly Income"] || "0").replace(/,/g, "")
          ),
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


  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b bg-white shadow-sm text-sm font-medium text-gray-700">
      {/* Search */}
      <div className="flex items-center gap-1 cursor-pointer">
        <MagnifyingGlassIcon className="w-5 h-5" />
        <span>Search</span>
      </div>

      {/* Person */}
      <div className="flex items-center gap-1 cursor-pointer">
        <UserCircleIcon className="w-5 h-5" />
        <span>Person</span>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1 cursor-pointer">
        <FunnelIcon className="w-5 h-5" />
        <span>Filter</span>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-1 cursor-pointer">
        <ArrowsUpDownIcon className="w-5 h-5" />
        <span>Sort</span>
      </div>

      {/* Hide */}
      <div className="flex items-center gap-1 cursor-pointer">
        <EyeSlashIcon className="w-5 h-5" />
        <span>Hide</span>
      </div>

      {/* Group by */}
      <div className="flex items-center gap-1 cursor-pointer">
        <Squares2X2Icon className="w-5 h-5" />
        <span>Group by</span>
      </div>

      {/* Upload */}
      <div
        className="flex items-center gap-1 cursor-pointer ml-auto text-blue-600"
        onClick={() => setUploadModalOpen(true)}
      >
        <ArrowUpOnSquareIcon className="w-5 h-5" />
        <span>Upload</span>
      </div>

      {/* More */}
      <div className="flex items-center gap-1 cursor-pointer">
        <EllipsisHorizontalIcon className="w-5 h-5" />
      </div>



            {/* Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Upload New Project</h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Project Name"
                className="w-full border p-2 rounded"
                value={formValues.projectName}
                onChange={(e) =>
                  setFormValues({ ...formValues, projectName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="ADL No."
                className="w-full border p-2 rounded"
                value={formValues.adl}
                onChange={(e) => setFormValues({ ...formValues, adl: e.target.value })}
              />
              <input
                type="number"
                placeholder="No. of Beneficiaries"
                className="w-full border p-2 rounded"
                value={formValues.beneficiaries}
                onChange={(e) =>
                  setFormValues({ ...formValues, beneficiaries: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Municipality"
                className="w-full border p-2 rounded"
                value={formValues.municipality}
                onChange={(e) =>
                  setFormValues({ ...formValues, municipality: e.target.value })
                }
              />
              <input type="file" accept=".csv" onChange={handleCSVUpload} />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
