// pages/success.tsx
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-center items-center font-sans">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-4xl font-bold text-green-600 mb-4">🎉 Đăng ký thành công!</h1>
        <p className="text-gray-700 mb-6">
          Chào mừng bạn đến với My Web. Bạn có thể bắt đầu trải nghiệm ngay.
        </p>

        {/* Thêm 2 nút Nhóm và Dự án */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push('/groups')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Nhóm
          </button>

          <button
            onClick={() => router.push('/groups')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
          >
            Dự án
          </button>
        </div>
      </div>
    </div>
  );
}
