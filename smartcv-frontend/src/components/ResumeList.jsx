import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllResumes, deleteResume } from "../api/resumeApi";

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await getAllResumes();
      console.log("Fetched resumes:", data);
      setResumes(data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadResumePdf = (id) => {
    window.open(`http://localhost:8080/api/resume/${id}/download`, "_blank");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await deleteResume(id); // ✅ call API
        setResumes(resumes.filter((r) => r.id !== id)); // remove from list
      } catch (error) {
        console.error("Error deleting resume:", error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!resumes || resumes.length === 0) return <p>No resumes found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📂 All Saved Resumes</h1>
      <ul className="space-y-4">
        {resumes.map((resume) => (
          <li
            key={resume.id}
            className="p-5 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow"
          >
            <p><strong>ID:</strong> {resume.id}</p>
            <p><strong>Name:</strong> {resume.name}</p>
            <p><strong>Email:</strong> {resume.email}</p>
            <p><strong>Phone:</strong> {resume.phone}</p>

            {resume.education && resume.education.length > 0 && (
              <div className="mt-2">
                <strong>Education:</strong>
                <ul className="list-disc list-inside">
                  {resume.education.map((edu, idx) => (
                    <li key={idx}>
                      {edu.degree} @ {edu.college}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resume.experience && resume.experience.length > 0 && (
              <div className="mt-2">
                <strong>Experience:</strong>
                <ul className="list-disc list-inside">
                  {resume.experience.map((exp, idx) => (
                    <li key={idx}>
                      {exp.title} at {exp.company}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ✅ Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/resume/${resume.id}`)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
              >
                View
              </button>
              <button
                onClick={() => navigate(`/resume/edit/${resume.id}`)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md text-sm"
              >
                Update
              </button>
              <button
                onClick={() => downloadResumePdf(resume.id)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm"
              >
                Download
              </button>
              <button
                onClick={() => handleDelete(resume.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumeList;
