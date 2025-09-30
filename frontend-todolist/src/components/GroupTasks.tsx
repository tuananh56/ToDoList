import { useEffect, useState } from "react";
import { taskService } from "../services/taskService";
import { groupService } from "../services/groupService";
import { Task, User, Group, CreateTaskDto } from "../types";

interface Props {
  groupId: number;
}

export default function GroupTasks({ groupId }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [group, setGroup] = useState<Group | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState<number | undefined>();
  const [deadline, setDeadline] = useState("");

  // ✅ Thêm currentUserId
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Load currentUserId từ localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const idStr = localStorage.getItem("userId");
      if (idStr) setCurrentUserId(Number(idStr));
    }
  }, []);

  // Load group và tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const g = await groupService.getGroupDetail(groupId);
        setGroup(g);

        const t = await taskService.getTasksByGroup(groupId);
        setTasks(t);
      } catch (err) {
        console.error("Lỗi fetch group/tasks:", err);
      }
    };
    fetchData();
  }, [groupId]);

  // Tạo task mới
  const handleCreateTask = async () => {
    if (!title.trim()) return alert("Nhập tiêu đề task");

    try {
      const dto: CreateTaskDto = {
        title,
        description: description || undefined,
        assigneeId: assigneeId || undefined,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
      };

      const newTask = await taskService.createTask(groupId, dto);

      setTasks([newTask, ...tasks]);
      setTitle("");
      setDescription("");
      setAssigneeId(undefined);
      setDeadline("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi tạo task");
    }
  };

  // ✅ Hàm kiểm tra quyền cập nhật trạng thái
  const canUpdateStatus = (task: Task) => {
    if (!group || !group.leader || !currentUserId) return false;
    return task.assignee?.id === currentUserId || group.leader.id === currentUserId;
  };

  if (!currentUserId) return <p>Đang xác thực người dùng...</p>;

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-2">{group?.name || "Group"} - Tasks</h2>

      {/* Form tạo task */}
      <div className="mb-4 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Tiêu đề task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-2 py-1 w-64"
        />
        <input
          type="text"
          placeholder="Mô tả (tùy chọn)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded px-2 py-1 w-64"
        />
        <select
          value={assigneeId || ""}
          onChange={(e) => setAssigneeId(Number(e.target.value) || undefined)}
          className="border rounded px-2 py-1 w-64"
        >
          <option value="">Chọn member (tùy chọn)</option>
          {group?.members.map((m: User) => (
            <option key={m.id} value={m.id}>
              {m.username}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border rounded px-2 py-1 w-64"
        />
        <button
          onClick={handleCreateTask}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-32"
        >
          Tạo Task
        </button>
      </div>

      {/* Danh sách task */}
      <ul className="list-disc list-inside">
        {tasks.map((t) => (
          <li key={t.id} className="mb-2 border p-2 rounded">
            <p className="font-semibold">{t.title}</p>
            <p>{t.description || "Không có mô tả"}</p>
            <p>
              Thực hiện: {t.assignee ? t.assignee.username : "Chưa giao"}
            </p>
            {t.deadline && (
              <p className="text-sm text-gray-500">
                Deadline: {new Date(t.deadline).toLocaleString()}
              </p>
            )}
            <p className="text-sm text-gray-400">Trạng thái: {t.status}</p>

            {/* ✅ Nút cập nhật trạng thái */}
            {canUpdateStatus(t) && (
              <div className="flex gap-2 mt-1">
                {["pending", "in_progress", "completed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => console.log("Cập nhật:", t.id, s)}
                    className={`px-2 py-1 rounded ${
                      t.status === s
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {s === "pending"
                      ? "Chưa làm"
                      : s === "in_progress"
                      ? "Đang làm"
                      : "Đã làm"}
                  </button>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
