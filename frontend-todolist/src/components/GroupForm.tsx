import { useState } from "react";
import axios from "axios";
import { Group } from "../types";

interface Props {
  token: string;
  onCreated: (group: Group) => void;
}

export default function GroupForm({ token, onCreated }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Bạn chưa đăng nhập.");
      return;
    }

    try {
      const res = await axios.post<Group>(
        "http://localhost:3001/groups",
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Group created:", res.data);
      onCreated(res.data);
      setName(""); // clear input
    } catch (err: any) {
      console.error("Error creating group:", err.response || err.message);
      setError(err.response?.data?.message || "Có lỗi xảy ra khi tạo group");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên group"
        className="flex-1 border p-2 rounded"
        required
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Tạo
      </button>
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </form>
  );
}
