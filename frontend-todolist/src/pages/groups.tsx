// pages/groups.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import GroupForm from "../components/GroupForm";
import GroupList from "../components/GroupList";
import { Group } from "../types";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Lấy token khi load trang
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setLoading(false);
  }, []);

  // ✅ Nếu chưa login → chuyển hướng sang /login
  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [loading, token, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-gray-500 font-medium text-lg animate-pulse">
          Đang kiểm tra đăng nhập...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ✅ Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center py-4">
            <h2
              onClick={() => router.push("/")}
              className="cursor-pointer text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent hover:opacity-80 transition"
            >
              ToDoList
            </h2>

            <nav className="flex gap-4">
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
              >
                🏠 Trang Chủ
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("username");
                  router.push("/login");
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
              >
                🚪 Đăng Xuất
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* ⭐ Main Content */}
      <main className="max-w-5xl mx-auto py-10 space-y-12">
        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Quản Lý Nhóm
          </h1>
          <p className="text-gray-600 mt-3 text-lg font-medium">
            Thêm nhóm mới hoặc quản lý nhóm hiện tại của bạn.
          </p>
        </div>

        {/* Form Section */}
        <section className="bg-white px-10 py-8 rounded-2xl shadow-lg border border-gray-200 transition hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Thêm nhóm mới
          </h2>
          <GroupForm
            token={token!}
            onCreated={(group) => setGroups((prev) => [...prev, group])}
          />
        </section>

        {/* List Section */}
        <section className="bg-white px-10 py-8 rounded-2xl shadow-lg border border-gray-200 transition hover:shadow-xl">
          <GroupList token={token!} groups={groups} setGroups={setGroups} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/10 text-center py-4 text-gray-600">
        © {new Date().getFullYear()} ToDoList - Quản lý nhóm công việc
      </footer>
    </div>
  );
}
