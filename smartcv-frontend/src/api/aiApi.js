// src/api/aiApi.js
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";


export const fetchAIResumeHelper = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/ai/resume-helper`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("AI request failed");
  return await res.json();
};
