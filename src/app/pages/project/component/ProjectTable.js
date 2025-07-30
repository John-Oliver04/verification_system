"use client";

import { useState, useRef } from "react";

export default function ProjectTable({ projects, loading, handleAction }) {
  const [searchText, setSearchText] = useState("");
 
  const filtered = projects.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div className="p-6">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search Projects"
          className="border rounded px-3 py-2 w-72"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          onClick={() => setUploadModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload Project
        </button>
      </div>

      {/* To-Do Section */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-blue-600">To-Do</h2>
        <table className="w-full text-sm  border-gray-100">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300">Project Name</th>
              <th className="p-2 border border-gray-300">ADL</th>
              <th className="p-2 border border-gray-300">Beneficiaries</th>
              <th className="p-2 border border-gray-300">Municipality</th>
              <th className="p-2 border border-gray-300">Progress</th>
              <th className="p-2 border border-gray-300">Status</th>
              <th className="p-2 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(
              (item, index) =>
                item.status !== "Completed" && (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border border-gray-300">{item.projectName}</td>
                    <td className="p-2 border border-gray-300">{item.adl}</td>
                    <td className="p-2 border border-gray-300 text-center">{item.beneficiaries}</td>
                    <td className="p-2 border border-gray-300">{item.municipality}</td>
                    <td className="p-2 border border-gray-300">
                      <div className="w-full bg-gray-200 rounded-full h-5 relative overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-5 rounded-full"
                          style={{
                            width: `${item.progress}`,
                            backgroundColor: "#3b82f6", // or use bg-blue-500 dynamically
                          }}
                        ></div>
                        <div className="h-5 w-full flex items-center justify-center text-xs font-medium text-gray-900 z-10 relative">
                          {item.progress}
                        </div>
                      </div>
                    </td>
                    <td
                      className={`p-2 border text-center text-white text-sm font-medium
                        ${
                          item.status === "Done"
                            ? "bg-green-600"
                            : item.status === "Working on it"
                            ? "bg-yellow-500"
                            : item.status === "Stuck"
                            ? "bg-red-600"
                            : item.status === "Not Started"
                            ? "bg-slate-500"
                            : "bg-gray-400"
                        }
                      `}
                    >
                      {item.status}
                    </td>



                    <td className="p-2 border  border-gray-300">
                      <select
                        className="border  border-gray-300 px-2 py-1 rounded"
                        onChange={(e) => handleAction(e.target.value, item)}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Action
                        </option>
                        <option value="validate">Validate</option>
                        <option value="view">View</option>
                        <option value="edit">Edit</option>
                        <option value="delete">Delete</option>
                        <option value="complete">Submit to Admin</option>
                      </select>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>

      {/* Completed Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-2 text-green-600">Completed</h2>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Project Name</th>
              <th className="p-2 border">ADL</th>
              <th className="p-2 border">Beneficiaries</th>
              <th className="p-2 border">Municipality</th>
              <th className="p-2 border">Progress</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(
              (item, index) =>
                item.status === "Completed" && (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border">{item.projectName}</td>
                    <td className="p-2 border">{item.adl}</td>
                    <td className="p-2 border text-center">{item.beneficiaries}</td>
                    <td className="p-2 border">{item.municipality}</td>
                    <td className="p-2 border">
                      <div className="w-full bg-gray-200 rounded-full h-5 relative">
                        <div
                          className="bg-blue-500 h-5 rounded-full text-white text-xs flex items-center justify-center"
                          style={{ width: `${item.progress}`}}
                        >
                          {item.progress}%
                        </div>
                      </div>
                    </td>
                    <td className="p-2 border text-green-600 font-semibold">Completed</td>
                    <td className="p-2 border text-center">—</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>


    </div>
  );
}
