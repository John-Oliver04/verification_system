"use client";
import { useState } from "react";
import Image from "next/image";


export default function ProjectTable({ projects, handleAction}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredProjects = projects.filter(p => p.status !== "Completed");

  const totalProjects = filteredProjects.length;
  const totalBeneficiaries = filteredProjects.reduce(
    (sum, p) => sum + Number(p.beneficiaries || 0),
    0
  );
  const totalDone = filteredProjects.filter(p => p.status === "Done").length;

  return (
    <div className="p-6">

      {/* To-Do Section */}
      
        <div className="">
          <div className="flex text-blue-600 border-b-4">
            <h4
              className="text-blue-600 cursor-pointer  text-xl "
              onClick={() => setIsCollapsed((prev) => !prev)}
            >
              {isCollapsed ? "▲" : "▼"}
            </h4>
            <h3 className="mx-4 text-xl font-bold mb-2 text-blue-600"> To Do</h3>
          </div>
          {!isCollapsed ? (
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
                {projects.map(
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
                  ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2 border-blue-100 border-b-1 text-orange-600">Summary</h3>
              <ul className="space-y-1 text-lg text-gray-700 flex justify-between">
                <li>
                    <Image width={32} height={32} className="inline-block mr-2" alt="Projects Icon" src="/icons/projects.png"/>
                    <span>
                      Total Projects: <strong className="text-blue-500">{totalProjects}</strong>
                    </span>
                  </li>
                <li>
                  <Image width={32} height={32} className="inline-block mr-2" alt="Done Icon" src="/icons/check.png"/>
                  <span>
                  Total Done Projects: <strong className="text-green-600">{totalDone}</strong>
                  </span>
                </li>

                <li>
                  <Image width={32} height={32} className="inline-block mr-2" alt="Beneficiaries Icon" src="/icons/user.png"/>
                  <span>
                    Total Beneficiaries: <strong className="text-gray-900">{totalBeneficiaries}</strong>
                  </span>
                </li>
              </ul>
            </div>
          )}
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
            {projects.map(
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
