import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function About() {
  const router = useRouter();

  // Giả lập user: nếu đã login thì user = { username: "Tuấn Anh" }
  const [user, setUser] = useState<{ username: string } | null>(null);

  // Giả lập lấy user từ localStorage / API
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-700 to-blue-600">
      {/* ⭐ Header giống Login/Register */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center py-4">
            <h2
              onClick={() => router.push("/")}
              className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent cursor-pointer"
            >
              ToDoList
            </h2>

            <nav className="flex gap-[12px]">
              <button
                onClick={() => router.push("/")}
                className="px-[16px] py-[10px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-[600] text-[15px] rounded-[6px] shadow-md transition-all"
              >
                🏠 Trang Chủ
              </button>

              {!user && (
                <>
                  <button
                    onClick={() => router.push("/login")}
                    className="px-[16px] py-[10px] bg-[#14B8A6] hover:bg-[#0D9488] text-white font-[600] text-[15px] rounded-[6px] shadow-md transition-all"
                  >
                    🔐 Đăng Nhập
                  </button>

                  <button
                    onClick={() => router.push("/register")}
                    className="px-[16px] py-[10px] bg-[#10B981] hover:bg-[#059669] text-white font-[600] text-[15px] rounded-[6px] shadow-md transition-all"
                  >
                    📝 Đăng Ký
                  </button>
                </>
              )}

             
            </nav>
          </div>
        </div>
      </header>

      {/* ⭐ Nội dung chính */}
      <main className="flex-grow flex flex-col items-center py-12 px-6">
        <h1 className="text-4xl font-extrabold text-white mb-6">
          📝 Giới thiệu & Chức năng ToDoList
        </h1>

        <p className="max-w-3xl text-lg text-white/90 text-center mb-12">
          ToDoList là ứng dụng quản lý công việc giúp bạn dễ dàng tổ chức dự án,
          phân chia nhiệm vụ và theo dõi tiến độ công việc một cách hiệu quả.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ⭐ Footer */}
      <footer className="bg-white/10 text-white text-center py-4">
        © {new Date().getFullYear()} ToDoList - Quản lý công việc hiệu quả
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "📋",
    title: "Quản lý công việc",
    description:
      "Tạo, chỉnh sửa, xóa và đánh dấu trạng thái các nhiệm vụ một cách dễ dàng.",
  },
  {
    icon: "👥",
    title: "Quản lý nhóm",
    description:
      "Tạo nhóm, mời thành viên, phân quyền trưởng nhóm để quản lý dự án hiệu quả.",
  },
  {
    icon: "📈",
    title: "Theo dõi tiến độ",
    description:
      "Xem tỷ lệ hoàn thành dự án và tiến độ công việc theo thời gian thực.",
  },
  {
    icon: "🛡️",
    title: "Phân quyền",
    description:
      "Quản lý quyền hạn của thành viên: Leader, Member để phân công công việc hiệu quả.",
  },
  {
    icon: "📅",
    title: "Lịch biểu",
    description:
      "Tích hợp lịch để xem và sắp xếp công việc theo ngày/tháng tiện lợi.",
  },
  {
    icon: "📊",
    title: "Báo cáo",
    description:
      "Xem báo cáo trực quan bằng biểu đồ để đánh giá năng suất và tiến độ.",
  },
];
