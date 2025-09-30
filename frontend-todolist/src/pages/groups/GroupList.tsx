// components/GroupList.tsx
import { useEffect, useState } from "react";
import { groupService } from "../../services/groupService";
import { Group } from "../../types";
import { useRouter } from "next/router";

export default function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const router = useRouter();

  useEffect(() => {
    groupService.getMyGroups().then(setGroups);
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        📋 Nhóm của tôi
      </h1>

      {groups.length === 0 ? (
        <p className="text-gray-500 text-center">Bạn chưa có nhóm nào.</p>
      ) : (
        <ul className="space-y-4">
          {groups.map((g) => (
            <li
              key={g.id}
              className="p-5 border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-all cursor-pointer bg-gray-50 hover:bg-white"
              onClick={() => router.push(`/groups/${g.id}`)}
            >
              <div className="flex justify-between items-center">
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
                Leader: <span className="font-medium">{g.leader?.username || "Chưa có"}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
