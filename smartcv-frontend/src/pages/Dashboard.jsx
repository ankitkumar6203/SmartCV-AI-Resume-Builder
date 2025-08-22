import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { getAllResumes } from "../api/resumeApi";
import AIChatBox from "../components/AIChatBox";

const Dashboard = () => {
  const [showAssistant, setShowAssistant] = useState(false);
  const [recentResumes, setRecentResumes] = useState([]);
  const navigate = useNavigate();

  // Fetch latest 5 resumes
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await getAllResumes();
        if (Array.isArray(data)) {
          setRecentResumes(data.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch resumes", err);
      }
    };
    fetchResumes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Welcome to <span className="text-blue-600">SmartCV</span>
        </h1>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={() => navigate("/resume/builder")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            ➕ Create New Resume
          </button>
          <button
            onClick={() => navigate("/resumes")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700"
          >
            📂 View All Resumes
          </button>
          <button
            onClick={() => setShowAssistant(!showAssistant)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            {showAssistant ? "❌ Close AI Assistant" : "🤖 Use AI Assistant"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Resumes */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-3">📄 Recent Resumes</h2>
            {recentResumes.length > 0 ? (
              <ul className="space-y-2">
                {recentResumes.map((resume, idx) => (
                  <li
                    key={idx}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/resume/${resume.id}`)}
                  >
                    <p className="font-medium">
                      {resume.name || "Untitled Resume"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {resume.createdAt
                        ? new Date(resume.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "No date available"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No resumes found.</p>
            )}
          </div>

          {/* AI Assistant */}
          {showAssistant && (
            <div className="bg-white rounded-xl shadow-lg p-4">
              <AIChatBox />
            </div>
          )}
        </div>
      </div>

      {/* Floating AI Assistant Button (mobile-friendly) */}
      {!showAssistant && (
        <button
          onClick={() => setShowAssistant(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        >
          🤖
        </button>
      )}
    </div>
  );
};

export default Dashboard;
