import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { groupService } from "../../services/groupService";
import { taskService } from "../../services/taskService";
import { Group, User, Task } from "../../types";

export default function GroupDetail() {
  const router = useRouter();
  const { id } = router.query;
  const groupId = Array.isArray(id) ? Number(id[0]) : Number(id);

  const [currentPage, setCurrentPage] = useState(1);
  const [group, setGroup] = useState<Group | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Form thêm thành viên
  const [keyword, setKeyword] = useState("");

  // Form tạo/sửa task
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState<
    number | undefined
  >(undefined);
  const [newTaskDeadline, setNewTaskDeadline] = useState("");

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editAssigneeId, setEditAssigneeId] = useState<number | undefined>();

  // ------------------- useEffect -------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      const idStr = localStorage.getItem("userId");
      if (idStr) setCurrentUserId(Number(idStr));
    }
  }, []);

  useEffect(() => {
    if (!groupId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const g = await groupService.getGroupDetail(groupId);
        setGroup(g);
        const t = await taskService.getTasksByGroup(groupId);
        setTasks(t);
      } catch (err) {
        console.error("Lỗi fetch group/tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [groupId]);

  // ------------------- Task CRUD -------------------
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description || "");
    setEditDeadline(
      task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : ""
    );
    setEditAssigneeId(task.assignee?.id);
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    try {
      const updatedTask = await taskService.updateTask(editingTask.id, {
        title: editTitle,
        description: editDesc,
        assigneeId: editAssigneeId,
        deadline: editDeadline
          ? new Date(editDeadline).toISOString()
          : undefined,
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
      setEditingTask(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi cập nhật task");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Bạn có chắc muốn xóa task này?")) return;
    try {
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      alert("Xóa task thành công!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi xóa task");
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return alert("Nhập tiêu đề task");
    try {
      const newTask = await taskService.createTask(groupId, {
        title: newTaskTitle,
        description: newTaskDesc,
        assigneeId: newTaskAssigneeId,
        deadline: newTaskDeadline
          ? new Date(newTaskDeadline).toISOString()
          : undefined,
      });
      setTasks((prev) => [newTask, ...prev]);
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskAssigneeId(undefined);
      setNewTaskDeadline("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi tạo task");
    }
  };

  const handleUpdateStatus = async (taskId: number, status: string) => {
    try {
      const updatedTask = await taskService.updateTaskStatus(
        taskId,
        status as "pending" | "in_progress" | "completed"
      );
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi cập nhật trạng thái task");
    }
  };

  // ------------------- Group actions -------------------
  const handleAddMember = async () => {
    if (!keyword.trim()) return alert("Nhập username hoặc email");
    try {
      await groupService.addMember(groupId, keyword);
      alert("Thêm thành viên thành công!");
      const g = await groupService.getGroupDetail(groupId);
      setGroup(g);
      setKeyword("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi thêm thành viên");
    }
  };

  const handleEndGroup = async () => {
    if (!confirm("Bạn có chắc muốn kết thúc nhóm này?")) return;
    try {
      await groupService.endGroup(groupId);
      const g = await groupService.getGroupDetail(groupId);
      setGroup(g);
      alert("Nhóm đã kết thúc!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi khi kết thúc nhóm");
    }
  };

  // ------------------- Helpers -------------------
  const canUpdateStatus = (task: Task) =>
    !!group?.leader &&
    (task.assignee?.id === currentUserId ||
      Number(group.leader.id) === currentUserId);

  if (loading) return <p className="p-6 text-gray-600">Đang tải...</p>;
  if (!group) return <p className="p-6 text-red-600">Không tìm thấy nhóm</p>;
  console.log("currentUserId:", currentUserId);
  console.log("leaderId:", group.leader?.id);
  console.log("isEnded:", group.isEnded);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition"
        >
          ← Quay lại trang chủ
        </button>

        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {group.name}
          </h1>
          <p className="text-lg text-gray-700">
            Leader:{" "}
            <span className="text-blue-600 font-semibold">
              {group.leader?.username}
            </span>{" "}
            <span className="text-gray-500">({group.leader?.email})</span>
          </p>
          <p className="mt-1 text-sm">
            Trạng thái:{" "}
            <span
              className={`font-semibold ${
                group.isEnded ? "text-red-600" : "text-green-600"
              }`}
            >
              {group.isEnded ? "Đã kết thúc" : "Đang hoạt động"}
            </span>
          </p>
        </div>
      </div>

      {/* Thành viên */}
      <div className="bg-white p-5 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Thành viên
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {group.members?.map((m: User) => (
            <li
              key={m.id}
              className="border p-3 rounded-lg hover:shadow-md transition flex flex-col gap-1"
            >
              <span className="font-medium text-gray-800">{m.username}</span>
              <span className="text-sm text-gray-500">{m.email}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Form thêm thành viên */}
      {!group.isEnded && (
        <div className="bg-blue-50 p-5 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-3 text-blue-700">
            Thêm thành viên
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Nhập username hoặc email..."
              className="border rounded-lg px-4 py-2 w-full sm:w-72 focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              onClick={handleAddMember}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Thêm
            </button>
          </div>
        </div>
      )}

      {/* Kết thúc nhóm */}
      {!group.isEnded && currentUserId === group.leader?.id && (
        <div className="mb-6">
          <button
            onClick={handleEndGroup}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            🛑 Kết thúc nhóm
          </button>
        </div>
      )}

      {/* Form tạo/sửa task */}
      {!group.isEnded && (
        <div className="bg-white p-5 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            {editingTask ? "Chỉnh sửa task" : "Tạo công việc mới"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={editingTask ? editTitle : newTaskTitle}
              onChange={(e) =>
                editingTask
                  ? setEditTitle(e.target.value)
                  : setNewTaskTitle(e.target.value)
              }
              placeholder="Tiêu đề task"
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={editingTask ? editDesc : newTaskDesc}
              onChange={(e) =>
                editingTask
                  ? setEditDesc(e.target.value)
                  : setNewTaskDesc(e.target.value)
              }
              placeholder="Mô tả task"
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="datetime-local"
              value={editingTask ? editDeadline : newTaskDeadline}
              onChange={(e) =>
                editingTask
                  ? setEditDeadline(e.target.value)
                  : setNewTaskDeadline(e.target.value)
              }
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={
                editingTask ? editAssigneeId || "" : newTaskAssigneeId || ""
              }
              onChange={(e) =>
                editingTask
                  ? setEditAssigneeId(Number(e.target.value))
                  : setNewTaskAssigneeId(Number(e.target.value))
              }
              className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Chọn người thực hiện (tùy chọn)</option>
              {group.members?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.username}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex gap-3">
            {editingTask ? (
              <>
                <button
                  onClick={handleUpdateTask}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => setEditingTask(null)}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                >
                  Hủy
                </button>
              </>
            ) : (
              <button
                onClick={handleCreateTask}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Tạo task
              </button>
            )}
          </div>
        </div>
      )}

      {/* Danh sách task */}
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Danh sách công việc
        </h2>
        {tasks.length === 0 ? (
          <p className="text-gray-600">Chưa có công việc nào</p>
        ) : (
          <ul className="space-y-4">
            {tasks.slice((currentPage - 1) * 5, currentPage * 5).map((t) => (
              <li
                key={t.id}
                className="border rounded-lg p-5 bg-gray-50 hover:shadow-lg transition"
              >
                <p className="font-bold text-lg text-gray-900">{t.title}</p>
                {t.description && (
                  <p className="text-gray-600 mb-1">{t.description}</p>
                )}
                {t.assignee && (
                  <p className="text-gray-700 mb-1">
                    Thực hiện:{" "}
                    <span className="font-semibold text-gray-900">
                      {t.assignee.username}
                    </span>
                  </p>
                )}
                {t.deadline && (
                  <p className="text-gray-700 mb-1">
                    Deadline:{" "}
                    <span className="font-medium text-red-600">
                      {new Date(t.deadline).toLocaleString()}
                    </span>
                  </p>
                )}
                <p className="mb-3 text-gray-700">
                  Trạng thái:{" "}
                  <span className="font-medium capitalize">{t.status}</span>
                </p>

                {!group.isEnded && canUpdateStatus(t) && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {["pending", "in_progress", "completed"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(t.id, status)}
                        className={`px-3 py-1 rounded-lg font-medium transition ${
                          t.status === status
                            ? status === "pending"
                              ? "bg-yellow-500 text-white"
                              : status === "in_progress"
                              ? "bg-blue-600 text-white"
                              : "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {status === "pending"
                          ? "Chưa làm"
                          : status === "in_progress"
                          ? "Đang làm"
                          : "Đã làm"}
                      </button>
                    ))}
                  </div>
                )}

                {!group.isEnded && (
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => handleEditTask(t)}
                      className="px-3 py-1 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteTask(t.id)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                    >
                      Xóa
                    </button>
                  </div>
                )}

                <p className="text-sm text-gray-400 mt-2">
                  Tạo lúc: {new Date(t.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {tasks.length > 5 && (
          <div className="flex justify-center items-center gap-3 mt-5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 transition"
              }`}
            >
              Trang trước
            </button>
            <span className="text-gray-700 font-medium">
              Trang {currentPage} / {Math.ceil(tasks.length / 5)}
            </span>
            <button
              disabled={currentPage === Math.ceil(tasks.length / 5)}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentPage === Math.ceil(tasks.length / 5)
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 transition"
              }`}
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
