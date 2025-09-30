// components/AddMemberForm.tsx
import { useState } from "react";
import axios from "axios";

interface Props {
  groupId: number;
  token: string;
  onAdded: () => void;
}

export default function AddMemberForm({ groupId, token, onAdded }: Props) {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        `http://localhost:3001/groups/${groupId}/add-member`,
        { userId: Number(userId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserId("");
      onAdded(); // reload danh sách member
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="number"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="flex-1 border p-2 rounded"
        required
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Thêm thành viên
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
