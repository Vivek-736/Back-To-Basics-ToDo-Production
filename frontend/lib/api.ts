const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function fetchTasksApi(
  token: string | null,
  status?: "all" | "pending" | "completed",
  sortBy?: "priority" | "dueDate" | "title"
) {
  if (!token) return [];
  const query = new URLSearchParams();
  if (status && status !== "all") query.append("status", status);
  if (sortBy) query.append("sortBy", sortBy);

  const res = await fetch(`${API_BASE_URL}/tasks?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch tasks: ${res.statusText}`);
  }
  return res.json();
}

export async function createTaskApi(
  token: string | null,
  data: { title: string; priority?: string; dueDate?: string }
) {
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to create task: ${res.statusText}`);
  }
  return res.json();
}

export async function updateTaskApi(
  token: string | null,
  id: string,
  data: { title?: string; priority?: string; completed?: boolean }
) {
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to update task: ${res.statusText}`);
  }
  return res.json();
}

export async function deleteTaskApi(token: string | null, id: string) {
  if (!token) throw new Error("Authentication required");

  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete task: ${res.statusText}`);
  }
  return res.json();
}