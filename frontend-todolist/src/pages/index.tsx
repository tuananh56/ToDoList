// pages/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  // --- state thống kê ---
  const [stats, setStats] = useState<any>(null);

  // --- state tạo task nhanh ---
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);

    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/tasks/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Stats từ BE:", data); // 👈 log để xem key thực tế
        setStats(data);
      })
      .catch((err) => console.error("Lỗi lấy thống kê:", err));
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

        // refresh thống kê
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
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              My Web
            </h2>

            {/* Navigation Buttons */}
            <nav className="flex flex-nowrap gap-[12px] overflow-x-auto">
              <button
                onClick={() => router.push("/")}
                className="px-[16px] py-[10px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-[600] text-[15px] rounded-[6px] shadow-[0_2px_6px_rgba(37,99,235,0.25)] transition-all"
              >
                🏠 Trang Chủ
              </button>

              {username ? (
                <button
                  onClick={() => {
                    localStorage.removeItem("username");
                    setUsername(null);
                    router.push("/login"); // có thể đổi thành "/" nếu muốn
                  }}
                  className="px-[16px] py-[10px] bg-red-500 hover:bg-red-600 text-white font-[600] text-[15px] rounded-[6px] shadow-[0_2px_6px_rgba(239,68,68,0.25)] transition-all"
                >
                  🚪 Đăng Xuất
                </button>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/login")}
                    className="px-[16px] py-[10px] bg-[#14B8A6] hover:bg-[#0D9488] text-white font-[600] text-[15px] rounded-[6px] shadow-[0_2px_6px_rgba(20,184,166,0.25)] transition-all"
                  >
                    🔐 Đăng Nhập
                  </button>

                  <button
                    onClick={() => router.push("/register")}
                    className="px-[16px] py-[10px] bg-[#10B981] hover:bg-[#059669] text-white font-[600] text-[15px] rounded-[6px] shadow-[0_2px_6px_rgba(16,185,129,0.25)] transition-all"
                  >
                    📝 Đăng Ký
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-24 text-center">
        <h1 className="text-5xl font-extrabold mb-6">
          Chào Mừng Đến Với My Web
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
          Khám phá thế giới số với những trải nghiệm tuyệt vời và dịch vụ chất
          lượng cao.
        </p>

        <div className="flex justify-center flex-wrap gap-6">
          <button
            onClick={() => {
              if (username) {
                router.push("/groups"); // đã đăng nhập thì vào trang nhóm
              } else {
                router.push("/login"); // chưa login thì vào login
              }
            }}
            className="px-[24px] py-[12px] bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-[0_2px_6px_rgba(0,0,0,0.1)]"
          >
            🚀 Bắt Đầu Ngay
          </button>

          <button className="px-[24px] py-[12px] border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
            🔍 Tìm Hiểu Thêm
          </button>
        </div>
      </section>

      {/* Quick Stats + Quick Create Task */}
      {username && (
        <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              📊 Thống kê nhanh
            </h3>

            {!stats ? (
              <p className="text-gray-500">Đang tải...</p>
            ) : (
              <ul className="grid grid-cols-2 gap-4 text-gray-700">
                <li className="bg-green-50 p-3 rounded-lg shadow">
                  ✅ Hoàn thành:{" "}
                  <span className="font-bold text-green-600">
                    {stats.completed ?? 0}
                  </span>
                </li>
                <li className="bg-yellow-50 p-3 rounded-lg shadow">
                  🚧 Đang làm:{" "}
                  <span className="font-bold text-yellow-600">
                    {stats.in_progress ?? 0}
                  </span>
                </li>
                <li className="bg-gray-50 p-3 rounded-lg shadow">
                  ⏳ Chưa làm:{" "}
                  <span className="font-bold text-gray-600">
                    {stats.pending ?? 0}
                  </span>
                </li>
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} My Web. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </footer>
    </div>
  );
}
