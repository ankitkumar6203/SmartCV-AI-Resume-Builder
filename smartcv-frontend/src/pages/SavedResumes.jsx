import React, { useState, useEffect } from "react";
import { getAllResumes, deleteResume } from "../api/resumeApi";
import { useNavigate } from "react-router-dom";

const SavedResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await getAllResumes();
      setResumes(response.data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await deleteResume(id);
        setResumes(resumes.filter((resume) => resume.id !== id));
      } catch (error) {
        console.error("Error deleting resume:", error);
      }
    }
  };

  if (loading) {
    return <p className="p-6">Loading resumes...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Saved Resumes</h1>

      {resumes.length === 0 ? (
        <p>No resumes saved yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="border p-4 rounded-lg shadow bg-white flex flex-col"
            >
              <h2 className="text-xl font-semibold">{resume.name}</h2>
              <p className="text-gray-600">{resume.email}</p>

              <div className="mt-auto flex gap-2 pt-4">
                <button
                  onClick={() => navigate(`/resume/view/${resume.id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/resume/edit/${resume.id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedResumes;
