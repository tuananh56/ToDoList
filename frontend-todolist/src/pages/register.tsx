import { useState } from "react";
import { useRouter } from "next/router";
import { registerApi } from "../services/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const res = await registerApi(username, email, password);
      console.log("Register success:", res);

      setSuccess("🎉 Đăng ký thành công! Đang chuyển sang trang đăng nhập...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      console.error("Register error:", err.response?.data);
      setError(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-700 to-blue-600">
      {/* ⭐ Header mới */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center py-4">
            <h2
              onClick={() => router.push("/")}
              className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent cursor-pointer"
            >
              ToDoList
            </h2>

            <nav className="flex flex-nowrap gap-[12px] overflow-x-auto">
              <button
                onClick={() => router.push("/")}
                className="px-[16px] py-[10px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-[600] text-[15px] rounded-[6px] shadow-[0_2px_6px_rgba(37,99,235,0.25)] transition-all"
              >
                🏠 Trang Chủ
              </button>

              <button
                onClick={() => router.push("/login")}
                className="px-[16px] py-[10px] bg-[#14B8A6] hover:bg-[#0D9488] text-white font-[600] text-[15px] rounded-[6px] shadow-[0_2px_6px_rgba(20,184,166,0.25)] transition-all"
              >
                🔐 Đăng Nhập
              </button>
              <button
                onClick={() => router.push("/about")}
                className="px-[16px] py-[10px] bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-[600] text-[15px] rounded-[6px] shadow-md transition-all"
              >
                ℹ️ Giới Thiệu
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* ⭐ Form Đăng Ký */}
      <div className="flex-grow flex items-center justify-center relative">
        {/* Background Decorative */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 w-full max-w-md relative z-10">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Đăng Ký
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-gray-700 mb-1">Tên người dùng</label>
              <input
                type="text"
                placeholder="Nhập tên người dùng"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Error & Success */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-500 text-sm text-center">{success}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-2 rounded-lg transition-all duration-300"
            >
              Đăng Ký
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Đã có tài khoản?{" "}
            <span
              className="text-purple-600 cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              Đăng nhập
            </span>
          </p>
        </div>
      </div>

      {/* ⭐ Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
      {/* ⭐ Footer */}
      <footer className="bg-white/10 text-white text-center py-4">
        © {new Date().getFullYear()} ToDoList - Quản lý công việc hiệu quả
      </footer>
    </div>
  );
}
