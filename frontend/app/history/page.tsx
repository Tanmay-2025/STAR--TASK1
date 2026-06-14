"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface HistoryLog {
  _id: string;
  action: string;
  quantity: number;
  createdAt: string;
  userId?: {
    name: string;
    email: string;
    role: string;
  };
  inventoryId?: {
    name: string;
    category: string;
  };
}

export default function HistoryPage() {
  const [logs, setLogs] = useState<
    HistoryLog[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  async function loadHistory() {
    try {
      const res = await fetchWithAuth(
        "/api/history"
      );

      const data = await res.json();

      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="min-h-screen p-8 pt-24">
      <h1 className="text-4xl font-bold mb-2">
        Inventory Audit Trail
      </h1>
      <button
  onClick={async () => {
    const token =
      localStorage.getItem("token");

    const res = await fetch(
      "/api/history/export",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      alert("Export failed");
      return;
    }

    const blob =
      await res.blob();

    const url =
      window.URL.createObjectURL(
        blob
      );

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      "inventory-history.csv";

    document.body.appendChild(a);
    a.click();
    a.remove();
  }}
  className="mb-6 px-4 py-2 bg-green-600 rounded"
>
  Export CSV
</button>

      <p className="text-muted-foreground mb-8">
        Complete history of inventory
        activity.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <div className="border rounded-xl p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">
                  Date
                </th>

                <th className="text-left py-3">
                  User
                </th>

                <th className="text-left py-3">
                  Item
                </th>

                <th className="text-left py-3">
                  Action
                </th>

                <th className="text-left py-3">
                  Quantity
                </th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr
                  key={log._id}
                  className="border-b"
                >
                  <td className="py-3">
                    {new Date(
                      log.createdAt
                    ).toLocaleString()}
                  </td>

                  <td className="py-3">
                    {log.userId?.name}
                  </td>

                  <td className="py-3">
                    {log.inventoryId?.name}
                  </td>

                  <td className="py-3 capitalize">
                    {log.action.replace(
                      /_/g,
                      " "
                    )}
                  </td>

                  <td className="py-3">
                    {log.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}