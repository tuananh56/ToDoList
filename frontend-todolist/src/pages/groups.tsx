// pages/groups.tsx
import { useEffect, useState } from "react";
import GroupForm from "../components/GroupForm";
import GroupList from "../components/GroupList";
import { Group } from "../types";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      setLoading(false);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-gray-500 font-medium text-lg animate-pulse">
          Đang kiểm tra đăng nhập...
        </p>
      </div>
    );

  if (!token)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-red-600 font-semibold text-lg">
          Bạn chưa đăng nhập. Vui lòng login trước.
        </p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen p-10">
      {/* Page Header */}
      <header className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Quản Lý Nhóm
        </h1>
        <p className="text-gray-600 mt-3 text-lg font-medium">
          Thêm nhóm mới hoặc quản lý nhóm hiện tại của bạn.
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto space-y-12">
        {/* Form Section */}
        <section className="bg-white px-10 py-8 rounded-2xl shadow-lg border border-gray-200 transition hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Thêm nhóm mới
          </h2>
          <GroupForm
            token={token}
            onCreated={(group) => setGroups((prev) => [...prev, group])}
          />
        </section>

        {/* List Section */}
        <section className="bg-white px-10 py-8 rounded-2xl shadow-lg border border-gray-200 transition hover:shadow-xl">
         
          <GroupList token={token} groups={groups} setGroups={setGroups} />
        </section>
      </main>
    </div>
  );
}
