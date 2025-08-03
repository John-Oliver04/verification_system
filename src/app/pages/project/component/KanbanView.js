"use client";
import React from "react";

export default function KanbanView({ projects }) {
  const statuses = ["Pending", "Working on it", "Completed"];

  const getBgColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-200";
      case "Working on it":
        return "bg-yellow-100";
      case "Completed":
        return "bg-green-100";
      default:
        return "bg-white";
    }
  };

  const columns = statuses.map((status) => ({
    title: status,
    items: projects.filter((p) => p.status === status),
  }));

  return (
    <div className="h-screen overflow-y-auto p-4 bg-white">
      <div className="flex gap-4 h-full pb-4">
        {columns.map((col) => (
          <div
            key={col.title}
            className="flex-1 bg-gray-100 rounded p-4 shadow h-full flex flex-col"
          >
            <h3 className="text-lg font-semibold text-center mb-2">{col.title}</h3>
            <div className="space-y-2 overflow-y-auto">
              {col.items.length > 0 ? (
                col.items.map((item) => (
                  <div
                    key={item._id}
                    className={`p-2 rounded shadow border text-sm ${getBgColor(
                      item.status
                    )}`}
                  >
                    <p className="font-semibold">{item.projectName}</p>
                    <p className="text-gray-700">{item.municipality}</p>
                    <p className="text-xs text-gray-600">
                      Beneficiaries: {item.beneficiaries}
                    </p>
                    <p className="text-xs text-gray-600">
                      Progress: {item.progress}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-xs">No projects</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
