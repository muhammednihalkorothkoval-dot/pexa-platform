"use client";

import { useMemo } from "react";

type ApplicationRow = {
  name: string;
  phone: string;
  city: string;
  bike: boolean;
  status: "Pending" | "Approved" | "Rejected";
};

export default function AdminApplicationsDashboard() {
  const applications: ApplicationRow[] = useMemo(
    () => [
      {
        name: "Rahul Kumar",
        phone: "9876543210",
        city: "Kochi",
        bike: true,
        status: "Pending",
      },
      {
        name: "Arjun Nair",
        phone: "9123456780",
        city: "Kannur",
        bike: false,
        status: "Pending",
      },
    ],
    []
  );

  const renderStatusBadge = (status: ApplicationRow["status"]) => {
    if (status === "Approved") {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Approved
        </span>
      );
    }

    if (status === "Rejected") {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
        Pending
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl bg-white p-8 shadow">
          <h1 className="text-2xl font-semibold text-[#111111]">Admin Applications Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            This view uses temporary mock data. Action buttons log to the console.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Phone Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    City
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Bike
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {applications.map((application) => (
                  <tr key={application.phone} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {application.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {application.phone}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {application.city}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {application.bike ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {renderStatusBadge(application.status)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => console.log("Approved:", application.name)}
                          className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => console.log("Rejected:", application.name)}
                          className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
