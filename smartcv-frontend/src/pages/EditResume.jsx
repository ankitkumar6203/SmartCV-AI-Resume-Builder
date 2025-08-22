import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import AIChatBox from "../components/AIChatBox";
import { getAllResumes } from "../api/resumeApi";

const EditResume = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState({
    fullName: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    experience: "",
    education: "",
  });

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const resumes = await getAllResumes();
        const existingResume = resumes.find((r) => r.id === parseInt(id));
        if (existingResume) {
          setResume(existingResume);
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    if (id) fetchResume();
  }, [id]);

  const handleChange = (e) => {
    setResume({ ...resume, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Save logic here ✅", resume);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resume Editor Form */}
        <div className="md:col-span-2 bg-white shadow p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-bold mb-4">✏️ Edit Resume</h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={resume.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={resume.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={resume.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <textarea
            name="summary"
            placeholder="Summary"
            value={resume.summary}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <textarea
            name="skills"
            placeholder="Skills"
            value={resume.skills}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <textarea
            name="experience"
            placeholder="Experience"
            value={resume.experience}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <textarea
            name="education"
            placeholder="Education"
            value={resume.education}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            💾 Save
          </button>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="bg-white shadow p-4 rounded-xl">
          <h2 className="text-lg font-bold mb-3">🤖 AI Resume Assistant</h2>
          <AIChatBox onSuggestion={(field, text) => {
            setResume((prev) => ({ ...prev, [field]: text }));
          }} />
        </div>
      </div>
    </div>
  );
};

export default EditResume;
