"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ApplicationRow = {
  id: string;
  name: string;
  phone: string;
  city: string;
  bike: boolean;
  status: "Pending" | "Approved" | "Rejected";
  license_front?: string;
  license_back?: string;
  aadhaar_front?: string;
  aadhaar_back?: string;
};

export default function AdminApplicationsDashboard() {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading applications:", error);
      setLoading(false);
      return;
    }

    const formatted: ApplicationRow[] =
      data?.map((item: any) => ({
        id: item.id,
        name: item.name,
        phone: item.phone,
        city: item.city,
        bike: item.bike === "yes",
        status:
          item.status === "approved"
            ? "Approved"
            : item.status === "rejected"
            ? "Rejected"
            : "Pending",
        license_front: item.license_front,
        license_back: item.license_back,
        aadhaar_front: item.aadhaar_front,
        aadhaar_back: item.aadhaar_back,
      })) || [];

    setApplications(formatted);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
      return;
    }

    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: status === "approved" ? "Approved" : "Rejected" }
          : app
      )
    );
  };

  const renderStatusBadge = (status: ApplicationRow["status"]) => {
    if (status === "Approved") {
      return (
        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Approved
        </span>
      );
    }

    if (status === "Rejected") {
      return (
        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading applications...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl bg-white p-8 shadow">
          <h1 className="text-2xl font-semibold">
            Admin Applications Dashboard
          </h1>

          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    City
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Bike
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Documents
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium">
                      {app.name}
                    </td>

                    <td className="px-4 py-4 text-sm">{app.phone}</td>

                    <td className="px-4 py-4 text-sm">{app.city}</td>

                    <td className="px-4 py-4 text-sm">
                      {app.bike ? "Yes" : "No"}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      {renderStatusBadge(app.status)}
                    </td>

                    <td className="px-4 py-4 text-sm">
                      <div className="flex flex-col gap-1">
                        {app.license_front && (
                          <a
                            href={app.license_front}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-xs"
                          >
                            License Front
                          </a>
                        )}

                        {app.license_back && (
                          <a
                            href={app.license_back}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-xs"
                          >
                            License Back
                          </a>
                        )}

                        {app.aadhaar_front && (
                          <a
                            href={app.aadhaar_front}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-xs"
                          >
                            Aadhaar Front
                          </a>
                        )}

                        {app.aadhaar_back && (
                          <a
                            href={app.aadhaar_back}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-xs"
                          >
                            Aadhaar Back
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          disabled={app.status === "Approved"}
                          onClick={() => updateStatus(app.id, "approved")}
                          className="rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-40"
                        >
                          Approve
                        </button>

                        <button
                          disabled={app.status === "Rejected"}
                          onClick={() => updateStatus(app.id, "rejected")}
                          className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {applications.length === 0 && (
              <p className="mt-6 text-center text-gray-500">
                No applications yet
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}