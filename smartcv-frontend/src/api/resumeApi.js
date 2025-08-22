import axios from "axios";

const API_URL = "http://localhost:8080/api/resume"; // base path

export async function generateResume(prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });
  return response.choices[0].message.content;
}

// ✅ Get all resumes
export const getAllResumes = async () => {
  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};

// ✅ Save a new resume
export const saveResume = async (resumeData) => {
  const response = await axios.post(API_URL, resumeData);
  return response.data;
};

// ✅ Get resume by ID
export const getResumeById = async (id) => {
  console.log(`Fetching resume from: ${API_URL}/${id}`);
  const response = await axios.get(`${API_URL}/${id}`);
  console.log("🔍 Backend raw response:", response);
  return response.data;
};

// ✅ View resume (alias endpoint)
export const viewResumeById = async (id) => {
  console.log(`Viewing resume from: ${API_URL}/view/${id}`);
  const response = await axios.get(`${API_URL}/view/${id}`);
  console.log("🔍 Backend raw response:", response);
  return response.data;
};

// ✅ Update resume
export const updateResume = async (id, resumeData) => {
  const response = await axios.put(`${API_URL}/${id}`, resumeData);
  return response.data;
};

// ✅ Delete resume
export const deleteResume = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// ✅ Download resume as PDF
export const downloadResume = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/download`, {
    responseType: "blob",  // ✅ ensures PDF comes as file
  });
  return response.data;
};

export const getRecentResumes = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/resume/recent");
    return await res.json();
  } catch (err) {
    console.error("Error fetching recent resumes:", err);
    return [];
  }
};
