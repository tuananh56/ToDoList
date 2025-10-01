import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Group } from "../types";

interface Props {
  token: string;
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  currentUser: { id: number; username: string };
}


export default function GroupList({ token, groups, setGroups }: Props) {
  const router = useRouter();

  useEffect(() => {
    // Chỉ fetch khi token tồn tại
    if (!token) return;

    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://localhost:3001/groups", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched groups:", res.data);
        setGroups(res.data);
      } catch (err: any) {
        console.error("Error fetching groups:", err.response?.data || err.message);
      }
    };

    fetchGroups();
  }, [token]); // ✅ chỉ token thôi

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Danh sách nhóm</h2>
      {groups.length === 0 ? (
        <p>Chưa có nhóm nào</p>
      ) : (
        <ul className="space-y-2">
          {groups.map((group) => (
            <li
              key={group.id}
              className="p-2 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/groups/${group.id}`)} // ✅ chuyển trang detail
            >
              {group.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
