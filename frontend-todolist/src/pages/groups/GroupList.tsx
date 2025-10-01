import { useEffect, useState } from "react";
import { groupService } from "../../services/groupService";
import { Group } from "../../types";
import { useRouter } from "next/router";

export default function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // TODO: lấy currentUser từ context, Redux, Zustand...
  const currentUser = { id: 1, username: "leader123" };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await groupService.getMyGroups();
        setGroups(data);
      } catch (err) {
        console.error("❌ Lỗi lấy nhóm:", err);
        setError("Không thể tải danh sách nhóm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleDelete = async (groupId: number) => {
    if (!confirm("Bạn có chắc muốn xóa nhóm này?")) return;
    try {
      await groupService.deleteGroup(groupId);
      setGroups(groups.filter((g) => g.id !== groupId));
    } catch (err) {
      console.error("❌ Lỗi xóa nhóm:", err);
      alert("Xóa nhóm thất bại!");
    }
  };

  const handleEdit = (groupId: number) => {
    router.push(`/groups/edit/${groupId}`);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📋 Nhóm của tôi</h1>

      {loading ? (
        <p className="text-gray-500 text-center">⏳ Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : groups.length === 0 ? (
        <p className="text-gray-500 text-center">Bạn chưa có nhóm nào.</p>
      ) : (
        <ul className="space-y-4">
          {groups.map((g) => (
            <li
              key={g.id}
              className="p-5 border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-all bg-gray-50 hover:bg-white"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => router.push(`/groups/${g.id}`)}
              >
                <p className="text-lg font-semibold text-gray-900">{g.name}</p>
                <span
                  className={`px-2 py-1 text-xs font-bold rounded-full ${
                    g.isEnded
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {g.isEnded ? "Đã kết thúc" : "Đang hoạt động"}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Leader:{" "}
                <span className="font-medium">
                  {g.leader?.username || "Chưa có"}
                </span>
              </p>
              {currentUser.id === g.leader?.id && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(g.id);
                    }}
                    className="px-3 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(g.id);
                    }}
                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
