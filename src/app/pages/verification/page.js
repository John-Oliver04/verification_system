"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import { Header } from "antd/es/layout/layout";

const VerificationPage = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const res = await fetch("/api/auth/beneficiary/list");
        const json = await res.json();
        if (json.success) {
          setBeneficiaries(json.data);
          setSelected(json.data[0]); // Set default selected
        } else {
          console.error("Failed to load beneficiaries:", json.error);
        }
      } catch (err) {
        console.error("Error fetching beneficiaries:", err);
      }
    };

    fetchBeneficiaries();
  }, []);

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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col text-xs">
        <Header />

        <section className="p-6">
          <div className="flex h-screen bg-gray-100">
            {/* Left Table */}
            <div className="w-3/5 p-6 overflow-y-auto">
              {/* Search */}
              <div className="flex items-center mb-4 space-x-2">
                <input
                  type="text"
                  placeholder="Search by name, location..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  Search
                </button>
              </div>

              {/* Table */}
              <table className="w-full text-sm bg-white shadow-md rounded-xl overflow-hidden">
                <thead className="text-left bg-gray-200">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Findings</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {beneficiaries.map((b) => (
                    <tr
                      key={b._id}
                      className={`border-b cursor-pointer ${
                        b.findings === "Qualified" ? "bg-green-500" :
                        b.findings === "Duplicate" ? "bg-red-600" :
                        b.findings === "Suspected" ? "bg-yellow-500" :
                        "hover:bg-gray-100"
                      }`}
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
                          handleUpdate(b._id, { stat: newStat }); // ⬅️ Save it
                        }}
                        className={`px-2 py-1 rounded-md text-xs font-semibold cursor-pointer ${STAT_COLORS[b.stat] || STAT_COLORS["Pending"]}`}
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
                            }); // ⬅️ Save it
                          }}
                          className={`px-2 py-1 rounded-md text-xs font-semibold cursor-pointer ${FINDINGS_COLORS[b.findings] || FINDINGS_COLORS["N/A"]}`}
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
            <div className="w-2/5 p-6 bg-white shadow-xl rounded-l-xl">
              {selected && (
                <>
                  <h2 className="text-xl font-bold mb-2">
                    {[selected.firstName, selected.middleName, selected.lastName, selected.extensionName]
                      .filter(Boolean)
                      .join(" ")}
                  </h2>

                  <div className="flex space-x-4 mb-4">
                    <button className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded">
                      Details
                    </button>
                    <button className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded hover:text-black">
                      Family Tree
                    </button>
                    <button className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded hover:text-black">
                      Notes
                    </button>
                  </div>

                  <div className="flex items-center justify-center mb-4">
                    <img
                      src="/avatar.png"
                      alt="avatar"
                      className="w-24 h-24 rounded-full border-2 border-gray-300"
                    />
                  </div>

                  <div className="text-sm space-y-2 text-gray-800">
                    <p><strong>Birthday:</strong> {selected.birthdate || "N/A"}</p>
                    <p><strong>Age:</strong> {selected.age || "N/A"}</p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {[selected.projectLocation?.barangay, selected.projectLocation?.cityMunicipality, selected.projectLocation?.province]
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </p>
                    <p><strong>Contact No.:</strong> {selected.contactNumber || "N/A"}</p>
                    <p><strong>Type of ID:</strong> {selected.typeOfID || "N/A"}</p>
                    <p><strong>ID Number:</strong> {selected.idNumber || "N/A"}</p>
                    <p><strong>Dependent:</strong> {selected.dependent || "N/A"}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VerificationPage;
