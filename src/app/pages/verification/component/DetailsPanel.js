"use client";

import React from "react";

const DetailsPanel = ({ selected, onClose, activePanel, setActivePanel }) => {
  if (!selected) return null;

  return (
    <div className="shadow-sm h-full fixed right-0 w-1/3 bg-gray-800 text-white shadow-xl z-50 rounded-l-xl flex flex-col">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">
            {[selected.firstName, selected.middleName, selected.lastName, selected.extensionName]
              .filter(Boolean)
              .join(" ")}
          </h2>
          <button
            onClick={onClose}
            className="text-lg px-2 rounded shadow-sm text-red-100 bg-red-400 hover:text-white hover:bg-red-500 text-sm"
            title="Close panel"
          >
            ✕
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded font-medium ${
              activePanel === "details" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActivePanel("details")}
          >
            Details
          </button>
          <button
            className={`px-3 py-1 text-sm rounded font-medium ${
              activePanel === "family" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActivePanel("family")}
          >
            Family Tree
          </button>
          <button
            className={`px-3 py-1 text-sm rounded font-medium ${
              activePanel === "notes" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActivePanel("notes")}
          >
            Notes
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto text-white p-6 text-gray-800 text-sm space-y-3">
        {activePanel === "details" && (
          <>
            <div className="flex justify-center mb-4">
              <img
                src="/beneficiary.png"
                alt="avatar"
                className="w-24 h-24 rounded-full border-2 border-gray-300"
              />
            </div>

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

            <div className="mt-4">
              <label htmlFor="notes" className="block font-semibold mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                rows="4"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your notes here..."
              />
            </div>
          </>
        )}

        {activePanel === "family" && (
          <div>
            <p className="italic ">Family Tree details coming soon...</p>
          </div>
        )}

        {activePanel === "notes" && (
          <div>
            <p className="italic ">Additional Notes UI or summary here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsPanel;
