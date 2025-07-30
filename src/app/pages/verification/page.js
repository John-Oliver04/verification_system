"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import { useSearchParams } from "next/navigation";
import DetailsPanel from "./component/DetailsPanel";
import { getUsername } from "@/app/components/GetUsername";

const VerificationPage = () => {

  // getting all the beneficiaries
  const [beneficiaries, setBeneficiaries] = useState([]);
  // getting selected Project
  const [selectedProject, setSelectedProject] = useState(null);

  const [username, setUsername] = useState("loading...");
  useEffect(() => {
    const fetchUsername = async () => {
      const name = await getUsername();  // no param needed
      setUsername(name);
    };
    fetchUsername();
  }, []);


// for searchbox
  const [searchTerm, setSearchTerm] = useState("");

  // for fetching data
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId"); 

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const res = await fetch(`/api/auth/beneficiary/list?projectId=${projectId}`);

        if (!res.ok) {
          const errorText = await res.text(); // Read response text to debug
          console.error("Server responded with error:", res.status, errorText);
          return;
        }

        const json = await res.json(); // Only parse if response is OK

        if (json && json.data && json.data.length > 0) {
          setBeneficiaries(json.data);
          setSelected(json.data[0]);
        } else {
          console.warn("No beneficiaries found.");
          setBeneficiaries([]);
          setSelected(null);
        }

      } catch (err) {
        console.error("Failed to load beneficiaries", err);
      }
    };

    if (projectId) {
      fetchBeneficiaries();
    }
    
  }, [projectId]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/auth/project/selectedproject/${projectId}`);
        if (!res.ok) {
          const errorText = await res.text(); // Read response text to debug
          console.error("Server responded with error:", res.status, errorText);
          return;
        }

        const json = await res.json();

        if (res.ok) {
          setSelectedProject(json.project);
        } else {
          console.error("Failed to fetch project:", json.message);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);


  // every time the dropdown in taable change it will save automatic into database
  const handleUpdate = async (id, updates) => {
    try {
      const res = await fetch("/api/auth/beneficiary/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        _id: id, // ✅ make sure this is defined
        updates
      }),
      });

      const json = await res.json();

      if (json.success) {
        console.log("Auto-saved successfully");
      } else {
        console.error("Save failed:", json.error);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  // for table colors if selected
  const [selected, setSelected] = useState(null);
  const STAT_COLORS = {
  Validated: "bg-green-100 text-green-700",
  "Working on it": "bg-yellow-100 text-yellow-700",
  Pending: "bg-gray-100 text-gray-700",
};

const FINDINGS_COLORS = {
  Duplicate: "bg-red-100 ",
  Suspected: "bg-orange-100 text-orange-700",
  "": "bg-gray-100 text-gray-700",
  "N/A": "bg-gray-100 text-gray-700",
}

// for details panel
 const [activePanel, setActivePanel] = useState("details");
 const [panelVisible, setPanelVisible] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col text-xs">
        <Header username={username} />

        {/* First Row: Project Summary Panel */}
        <div className="bg-white p-6 shadow rounded ">

          {/* Project Info */}
          <div>
            {selectedProject ? (
              <div>
                <h5 className="text-sm">
                  <b>Project:</b> {selectedProject.projectName}
                </h5>
                <p className="text-sm">
                  <b>Project Location:</b> {selectedProject.municipality || "N/A"}
                </p>
                <p className="text-sm">
                  <b>ADL No.:</b> {selectedProject.adl}
                </p>
              </div>
            ) : (
              <p className="text-sm italic text-gray-400">Loading project info...</p>
            )}

          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="bg-blue-100 p-3 rounded shadow text-center">
              <p className="text-xs text-gray-700">Total Beneficiaries</p>
              <h2 className="text-base font-bold text-gray-500">{beneficiaries.length}</h2>
            </div>

            <div className="bg-green-100 p-3 rounded shadow text-center">
              <p className="text-xs text-gray-700">Total Verified</p>
              <h2 className="text-base font-bold text-green-500">
                {beneficiaries.filter(b => b.stat === "Validated").length}
              </h2>
            </div>

            <div className="bg-red-100 p-3 rounded shadow text-center">
              <p className="text-xs text-gray-700">Duplicates</p>
              <h2 className="text-base text-red-500 font-bold">
                {beneficiaries.filter(b => b.findings === "Duplicate").length}
              </h2>
            </div>

            <div className="bg-yellow-100 p-3 rounded shadow text-center">
              <p className="text-xs text-gray-700">Suspected</p>
              <h2 className="text-base font-bold text-yellow-600">
                {beneficiaries.filter(b => b.findings === "Suspected").length}
              </h2>
            </div>

            <div className="bg-gray-200 p-3 rounded shadow text-center">
              <p className="text-xs text-gray-700">Rejected</p>
              <h2 className="text-base text-gray-700 font-bold">
                {beneficiaries.filter(b => b.findings === "Not Qualified").length}
              </h2>
            </div>
          </div>
        </div>


        {/* Details Panel */}
        {!panelVisible && (
          <div className="fixed top-24 right-2 z-50 ">
            <button
              onClick={() => setPanelVisible(true)}
              className=" transform -rotate-90 origin-right bg-gray-800 text-white px-3 py-2 rounded-t-lg shadow-lg hover:bg-gray-700 text-sm"
            >
              Show Details
            </button>
          </div>
        )}

        <section className="p-6">
          <div className="flex h-screen">
            {/* Left Table */}
            <div className={`${panelVisible ? "w-3/5" : "w-full"} transition-all duration-300 p-6 overflow-y-auto`}>
              {/* Search */}
              <div className="flex items-center mb-4 space-x-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Table */}
              <table className="w-full text-sm table-auto bg-white shadow-md rounded-xl overflow-hidden">
                <thead className="text-left bg-gray-200">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Findings</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                   {beneficiaries.filter((b) => {
                      const fullName = [b.firstName, b.middleName, b.lastName, b.extensionName]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();
                      return fullName.includes(searchTerm.toLowerCase());
                    })
                    .map((b, idx) => (

                    <tr
                      key={idx}
                      className={`border-b border-gray-100 cursor-pointer
                        ${selected && selected._id === b._id
                          ? "bg-gray-800 text-white"
                          : b.findings === "Qualified"
                          ? "bg-green-500"
                          : b.findings === "Duplicate"
                          ? "bg-red-600"
                          : b.findings === "Suspected"
                          ? "bg-yellow-500"
                          : "hover:bg-gray-800 hover:text-white"}
                      `}
                      onClick={() => setSelected(b)}
                    >
                      <td className="p-3 font-medium">
                        {[b.firstName, b.middleName, b.lastName, b.extensionName]
                          .filter(Boolean)
                          .join(" ")}
                      </td>

                      <td className="p-3">
                        <select
                          value={b.stat || "Pending"}
                          onChange={(e) => {
                            const newStat = e.target.value;
                            setBeneficiaries((prev) =>
                              prev.map((ben) =>
                                ben._id === b._id ? { ...ben, stat: newStat } : ben
                              )
                            );
                            handleUpdate(b._id, { stat: newStat });
                          }}
                          className={`px-2 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                            STAT_COLORS[b.stat] || STAT_COLORS["Pending"]
                          }`}
                        >
                          <option value="Validated">Validated</option>
                          <option value="Working on it">Working on it</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </td>

                      <td className="p-3">
                        <select
                          value={b.findings || "N/A"}
                          onChange={(e) => {
                            const newFindings = e.target.value;
                            const autoStat =
                              newFindings === "Qualified"
                                ? "Validated"
                                : newFindings === "Suspected"
                                ? "Working on it"
                                : b.stat;
                            setBeneficiaries((prev) =>
                              prev.map((ben) =>
                                ben._id === b._id
                                  ? { ...ben, findings: newFindings, stat: autoStat }
                                  : ben
                              )
                            );

                            handleUpdate(b._id, {
                              findings: newFindings,
                              stat: autoStat,
                            });
                          }}
                          className={`px-2 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                            FINDINGS_COLORS[b.findings] || FINDINGS_COLORS["N/A"]
                          }`}
                        >
                          <option value=""></option>
                          <option value="Qualified">Qualified</option>
                          <option value="Duplicate">Duplicate</option>
                          <option value="Suspected">Suspected</option>
                          <option value="Not Qualified">Not Qualified</option>
                        </select>
                      </td>

                      <td className="p-3">
                        <button className="px-4 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                          Action
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right Details Panel */}
            {panelVisible && selected && (
              <DetailsPanel
                selected={selected}
                onClose={() => setPanelVisible(false)}
                activePanel={activePanel}
                setActivePanel={setActivePanel}
              />
            )}

          </div>
        </section>
      </main>
    </div>
  );
};

export default VerificationPage;
