// pages/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);

    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3001/tasks/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch((err) => console.error("Lỗi lấy thống kê:", err));
    }
  }, []);

  const handleQuickCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Nhập tiêu đề task!");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/tasks/quick-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, deadline }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Tạo task thành công 🎉");
        setTitle("");
        setDeadline("");

        // Refresh thống kê
        fetch("http://localhost:3001/tasks/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => setStats(data));
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans p-5 animate-fadeIn">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center py-4">
            <h2
              className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent cursor-pointer"
              onClick={() => router.push("/")}
            >
              ToDoList
            </h2>

            {/* Navigation */}
            <nav className="flex gap-4 items-center">
              {!username ? (
                <>
                  <button
                    onClick={() => router.push("/login")}
                    className="px-[16px] py-[10px] bg-[#14B8A6] hover:bg-[#0D9488] text-white font-semibold rounded-[6px] shadow-md transition-all"
                  >
                    🔐 Đăng Nhập
                  </button>

                  <button
                    onClick={() => router.push("/register")}
                    className="px-[16px] py-[10px] bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-[6px] shadow-md transition-all"
                  >
                    📝 Đăng Ký
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    localStorage.removeItem("username");
                    localStorage.removeItem("token");
                    setUsername(null);
                    router.push("/login");
                  }}
                  className="px-[16px] py-[10px] bg-red-500 hover:bg-red-600 text-white font-semibold rounded-[6px] shadow-md transition-all"
                >
                  🚪 Đăng Xuất
                </button>
              )}

              <button
                onClick={() => router.push("/about")}
                className="px-[16px] py-[10px] bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold rounded-[6px] shadow-md transition-all"
              >
                ℹ️ Giới Thiệu
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-24 text-center">
        <h1 className="text-5xl font-extrabold mb-6">
          Chào Mừng Đến Với ToDoList
        </h1>

        <div className="mb-8">
          {username ? (
            <div className="bg-white bg-opacity-20 rounded-xl p-6 inline-block">
              <p className="text-xl font-semibold">
                Xin chào, <span className="text-yellow-300">{username}</span>!
                👋
              </p>
              <p className="text-blue-100 mt-2 text-lg">
                Chúc bạn có một ngày tuyệt vời!
              </p>
            </div>
          ) : (
            <div className="bg-white bg-opacity-20 rounded-xl p-6 inline-block">
              <p className="text-xl font-medium">
                Vui lòng đăng nhập hoặc đăng ký để bắt đầu! 🚀
              </p>
            </div>
          )}
        </div>

        <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
          Khám phá thế giới số với những trải nghiệm <br /> tuyệt vời và dịch vụ
          chất lượng cao.
        </p>

        <div className="flex justify-center flex-wrap gap-6">
          <button
            onClick={() => {
              if (username) {
                router.push("/groups");
              } else {
                router.push("/login");
              }
            }}
            className="px-[24px] py-[12px] bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-md"
          >
            🚀 Bắt Đầu Ngay
          </button>

          <button
            onClick={() => router.push("/about")}
            className="px-[24px] py-[12px] border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-md"
          >
            🔍 Tìm Hiểu Thêm
          </button>
        </div>
      </section>

      {/* Stats */}
      {username && (
        <section className="max-w-5xl mx-auto py-16 px-6">
          <h3 className="text-3xl font-extrabold text-center text-gray-800 mb-12">
            📊 Thống Kê Hoạt Động
          </h3>

          {!stats ? (
            <p className="text-gray-500 text-center text-lg animate-pulse">
              Đang tải dữ liệu...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* ✅ Hoàn thành */}
              <div className="bg-gradient-to-br from-green-400 to-green-500 text-white rounded-2xl shadow-lg p-6">
                <h4 className="text-xl font-semibold">✅ Hoàn thành</h4>
                <p className="text-5xl font-extrabold mt-4">
                  {stats.completed ?? 0}
                </p>
              </div>

              {/* 🚧 Đang làm */}
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white rounded-2xl shadow-lg p-6">
                <h4 className="text-xl font-semibold">🚧 Đang làm</h4>
                <p className="text-5xl font-extrabold mt-4">
                  {stats.inProgress ?? 0}
                </p>
              </div>

              {/* ⏳ Chưa làm */}
              <div className="bg-gradient-to-br from-gray-400 to-gray-600 text-white rounded-2xl shadow-lg p-6">
                <h4 className="text-xl font-semibold">⏳ Chưa làm</h4>
                <p className="text-5xl font-extrabold mt-4">
                  {stats.pending ?? 0}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white/10 text-white text-center py-4">
        © {new Date().getFullYear()} ToDoList - Quản lý công việc hiệu quả
      </footer>
    </div>
  );
}
