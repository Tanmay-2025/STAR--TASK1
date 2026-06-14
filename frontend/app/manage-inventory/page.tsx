"use client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  qrCode?: string;
}

export default function ManageInventoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({
  inventoryTypes: 0,
  totalUnits: 0,
  issuedUnits: 0,
  pendingRequests: 0,
});

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
 const [borrowQuantities, setBorrowQuantities] =
  useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
  useState("all");
  const [editingItem, setEditingItem] =
  useState<any>(null);
  const [scanResult, setScanResult] =
  useState("");
  const [scannedItem, setScannedItem] =
  useState<any>(null);
  const [checkingAuth, setCheckingAuth] =
  useState(true);

const [selectedItem, setSelectedItem] =
  useState<any>(null);
  

  const role =
    typeof window !== "undefined"
      ? localStorage.getItem("role")
      : "";

  async function loadInventory() {
    const res = await fetchWithAuth("/api/inventory");
    const data = await res.json();

    if (data.success) {
      setItems(data.items);
    }
  }

  async function loadStats() {
    const res = await fetchWithAuth("/api/dashboard");
    const data = await res.json();

    if (data.success) {
      setStats(data);
    }
  }

  async function loadRequests() {
  const res = await fetchWithAuth("/api/borrow");
  const data = await res.json();

  if (data.success) {
    if (role === "admin") {
  setRequests(data.requests);
} else {
  const userId =
    localStorage.getItem("userId");

  setRequests(
    data.requests.filter(
      (request: any) =>
        request.userId?._id === userId
    )
  );
}
  }
}

  async function addItem() {
    const res = await fetchWithAuth("/api/inventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        category,
        totalQuantity: Number(totalQuantity),
        availableQuantity: Number(availableQuantity),
      }),
    });

    const data = await res.json();

    if (data.success) {
      setName("");
      setCategory("");
      setTotalQuantity("");
      setAvailableQuantity("");

      loadInventory();
      loadStats();
    }
  }
  async function updateItem() {
  if (!editingItem) return;

  const res = await fetchWithAuth(
    `/api/inventory/${editingItem._id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editingItem.name,
        category: editingItem.category,
        totalQuantity:
          editingItem.totalQuantity,
        availableQuantity:
          editingItem.availableQuantity,
      }),
    }
  );

  const data = await res.json();

  if (data.success) {
    setEditingItem(null);

    loadInventory();
    loadStats();
  } else {
    alert("Failed to update item");
  }
}

  async function deleteItem(id: string) {
    await fetchWithAuth(`/api/inventory/${id}`, {
      method: "DELETE",
    });

    loadInventory();
    loadStats();
  }

  async function borrowItem(
  itemId: string
) {
  const res = await fetchWithAuth("/api/borrow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inventoryId: itemId,
      quantity: Number(
        borrowQuantities[itemId] || 1
      ),
    }),
  });

  const data = await res.json();

  if (data.success) {
    alert("Borrow request submitted");

    setBorrowQuantities({
      ...borrowQuantities,
      [itemId]: "1",
    });

    loadRequests();
    loadStats();
  }
}
 async function updateRequest(
  requestId: string,
  action: string
) {
  const res = await fetchWithAuth(
  `/api/borrow/${requestId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
      }),
    }
  );

  const data = await res.json();

  if (data.success) {
    loadRequests();
    loadInventory();
    loadStats();
  }
}
 async function handleQrUpload(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const file = e.target.files?.[0];

  if (!file) return;

  const jsQR = (await import("jsqr")).default;

  const image = new Image();

  image.src = URL.createObjectURL(file);

  image.onload = () => {
    const canvas =
      document.createElement("canvas");

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);

    const imageData =
      ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

    const code = jsQR(
      imageData.data,
      canvas.width,
      canvas.height
    );

    if (!code) {
      alert("QR code not found");
      return;
    }

    setScanResult(code.data);

console.log("Scanned:", code.data);

console.log("All Items:", items);

const foundItem = items.find(
  (item: any) =>
    item.qrValue === code.data
);

console.log("Found Item:", foundItem);

setScannedItem(foundItem || null);
  };
}

 useEffect(() => {
  const token =
    localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  setCheckingAuth(false);

  loadInventory();
  loadStats();
  loadRequests();
}, []);

if (checkingAuth) {
  return null;
}
  return (
    <div className="min-h-screen p-8 pt-24">
      <h1 className="text-4xl font-bold mb-2">
        STAC Inventory Dashboard
      </h1>

      <p className="mb-8 text-orange-500">
        Logged in as: {role}
      </p>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-6">
          <h3 className="text-xl font-semibold">
  Inventory Types
</h3>

<p className="text-3xl mt-2">
  {stats.inventoryTypes}
</p>
        </div>

        <div className="border rounded-xl p-6">
          <h3 className="text-xl font-semibold">
  Total Units
</h3>

<p className="text-3xl mt-2">
  {stats.totalUnits}
</p>
        </div>


        <div className="border rounded-xl p-6">
          <h3 className="text-xl font-semibold">
  Issued Units
</h3>

<p className="text-3xl mt-2">
  {stats.issuedUnits}
</p>
        </div>

        <div className="border rounded-xl p-6">
  <h3 className="text-xl font-semibold">
    Pending Requests
  </h3>

  <p className="text-3xl mt-2">
    {stats.pendingRequests}
  </p>
</div>
      </div>

{/* Upload QR Code */}
<div className="border rounded-xl p-6 mb-8">
  <h2 className="text-2xl font-bold mb-4">
    Upload QR Code
  </h2>

  <input
    type="file"
    accept="image/*"
    onChange={handleQrUpload}
    className="border p-2 rounded"
  />

  {scanResult && (
    <div className="mt-4">
      <p className="text-green-500">
        Scanned QR:
      </p>

      <p className="font-semibold">
        {scanResult}
      </p>
    </div>
  )}
  {scannedItem && (
  <div className="mt-4 border rounded p-4">
    <h3 className="font-bold">
      Inventory Item Found
    </h3>

    <p>Name: {scannedItem.name}</p>

    <p>
      Category:
      {" "}
      {scannedItem.category}
    </p>

    <p>
      Available:
      {" "}
      {scannedItem.availableQuantity}
    </p>
  </div>
)}
</div>

      {/* Add Item */}
      {role === "admin" && (
  <div className="border rounded-xl p-6 mb-8">
    <h2 className="text-2xl font-bold mb-4">
      Add Inventory Item
    </h2>

    <div className="grid md:grid-cols-4 gap-3">
      <input
        className="border p-2 rounded"
        placeholder="Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        className="border p-2 rounded"
        placeholder="Category"
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      />

      <input
        className="border p-2 rounded"
        placeholder="Total Qty"
        value={totalQuantity}
        onChange={(e) =>
          setTotalQuantity(e.target.value)
        }
      />

      <input
        className="border p-2 rounded"
        placeholder="Available Qty"
        value={availableQuantity}
        onChange={(e) =>
          setAvailableQuantity(e.target.value)
        }
      />
    </div>

    <button
      onClick={addItem}
      className="mt-4 px-4 py-2 bg-orange-500 rounded"
    >
      Add Item
    </button>
  </div>
)}

      {/* Inventory Table */}
      <div className="border rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">
  Inventory
</h2>

<input
  type="text"
  placeholder="Search by name or category..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  className="border rounded p-2 mb-4 w-full"
/>

        <table className="w-full">
          <thead>
  <tr className="border-b">
    <th className="text-left py-2">
      Name
    </th>

    <th className="text-left py-2">
      Category
    </th>

    <th className="text-left py-2">
      Total
    </th>

    <th className="text-left py-2">
  Available
</th>

<th className="text-left py-2">
  QR Code
</th>

<th className="text-left py-2">
  Action
</th>
  </tr>
</thead>

          <tbody>
            {items
  .filter(
    (item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.category
        .toLowerCase()
        .includes(search.toLowerCase())
  )
  .map((item) => (
              <tr
  key={item._id}
  className="border-b"
>
  <td className="py-2">
    {item.name}
  </td>

  <td className="py-2">
    {item.category}
  </td>

  <td className="py-2">
    {item.totalQuantity}
  </td>

  <td className="py-2">
  {item.availableQuantity}
</td>

<td className="py-2">
  {item.qrCode ? (
    <div className="flex items-center gap-2">
      <img
        src={item.qrCode}
        alt="QR Code"
        className="w-16 h-16 border rounded"
      />

      <a
        href={item.qrCode}
        download={`${item.name}-qr.png`}
        className="text-blue-500 text-sm"
      >
        Download
      </a>
    </div>
  ) : (
    "-"
  )}
</td>

<td className="space-x-3">
 {role === "admin" && (
  <>
    <button
      onClick={() =>
        setEditingItem(item)
      }
      className="text-blue-500"
    >
      Edit
    </button>

    <button
      onClick={() =>
        deleteItem(item._id)
      }
      className="text-red-500 ml-2"
    >
      Delete
    </button>
  </>
)}

  {role !== "admin" && (
  <>
    <input
  type="number"
  min="1"
  value={
    borrowQuantities[item._id] || "1"
  }
  onChange={(e) =>
    setBorrowQuantities({
      ...borrowQuantities,
      [item._id]: e.target.value,
    })
  }
  className="border rounded px-2 py-1 w-20"
/>
    <button
  disabled={
    item.availableQuantity === 0
  }
  onClick={() => borrowItem(item._id)}
  className={`ml-2 ${
    item.availableQuantity === 0
      ? "text-gray-500"
      : "text-green-500"
  }`}
>
  {item.availableQuantity === 0
    ? "Unavailable"
    : "Borrow"}
</button> 
  </>
)}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Borrow Requests */}
<div className="border rounded-xl p-6 mt-8">
  <h2 className="text-2xl font-bold mb-4">
  Borrow Requests
</h2>

<select
  value={statusFilter}
  onChange={(e) =>
    setStatusFilter(
      e.target.value
    )
  }
  className="border rounded p-2 mb-4"
>
  <option value="all">
    All Requests
  </option>

  <option value="pending">
    Pending
  </option>

  <option value="approved">
    Approved
  </option>

  <option value="rejected">
    Rejected
  </option>

  <option value="return_pending">
    Return Pending
  </option>

  <option value="completed">
    Returned
  </option>
</select>

  <table className="w-full text-left">
    <thead>
  <tr className="border-b">
    <th className="text-left py-2">
      Requested By
    </th>

    <th className="text-left py-2">
      Item
    </th>
    <th className="text-left py-2">
  Quantity
</th>

    <th className="text-left py-2">
      Status
    </th>

    <th className="text-left py-2">
      Actions
    </th>
  </tr>
</thead>

    <tbody>
      {requests
  .filter(
    (request) =>
      statusFilter === "all" ||
      request.status ===
        statusFilter
  )
  .map((request) => (
        <tr
  key={request._id}
  className="border-b"
>
  <td className="py-2">
    {request.userId?.name}
  </td>

  <td className="py-2">
    {request.inventoryId?.name}
  </td>
  <td className="py-2">
  {request.quantity}
</td>

  <td className="py-2">
    {request.status}
  </td>

  <td className="py-2 space-x-2">
            {role === "admin" &&
              request.status ===
                "pending" && (
                <>
                  <button
                    onClick={() =>
                      updateRequest(
                        request._id,
                        "approve"
                      )
                    }
                    className="text-green-500"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateRequest(
                        request._id,
                        "reject"
                      )
                    }
                    className="text-red-500"
                  >
                    Reject
                  </button>
                </>
              )}

            {role !== "admin" &&
              request.status ===
                "approved" && (
                <button
                  onClick={() =>
                    updateRequest(
                      request._id,
                      "return"
                    )
                  }
                  className="text-yellow-500"
                >
                  Return Item
                </button>
              )}

            {role === "admin" &&
              request.status ===
                "return_pending" && (
                <button
                  onClick={() =>
                    updateRequest(
                      request._id,
                      "confirm_return"
                    )
                  }
                  className="text-blue-500"
                >
                  Confirm Return
                </button>
              )}
              {request.status === "approved" && (
  <span className="text-green-500">
    Approved
  </span>
)}

{request.status === "rejected" && (
  <span className="text-red-500">
    Rejected
  </span>
)}

{request.status === "completed" && (
  <span className="text-blue-500">
    Returned
  </span>
)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
{editingItem && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white text-black p-6 rounded-xl w-[500px]">
      <h2 className="text-2xl font-bold mb-4">
        Edit Inventory Item
      </h2>

      <input
        className="border p-2 rounded w-full mb-3"
        value={editingItem.name}
        onChange={(e) =>
          setEditingItem({
            ...editingItem,
            name: e.target.value,
          })
        }
      />

      <input
        className="border p-2 rounded w-full mb-3"
        value={editingItem.category}
        onChange={(e) =>
          setEditingItem({
            ...editingItem,
            category: e.target.value,
          })
        }
      />

      <input
        type="number"
        className="border p-2 rounded w-full mb-3"
        value={editingItem.totalQuantity}
        onChange={(e) =>
          setEditingItem({
            ...editingItem,
            totalQuantity: Number(
              e.target.value
            ),
          })
        }
      />

      <input
        type="number"
        className="border p-2 rounded w-full mb-4"
        value={
          editingItem.availableQuantity
        }
        onChange={(e) =>
          setEditingItem({
            ...editingItem,
            availableQuantity: Number(
              e.target.value
            ),
          })
        }
      />

      <div className="flex gap-3">
        <button
          onClick={updateItem}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>

        <button
          onClick={() =>
            setEditingItem(null)
          }
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}