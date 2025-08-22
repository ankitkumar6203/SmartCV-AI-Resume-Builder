import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { viewResumeById, downloadResume } from "../api/resumeApi"; // ✅ using only viewResumeById

const ResumeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await viewResumeById(id); // ✅ call /view/{id}
      setResume(res); // ✅ no .data here
    } catch (error) {
      console.error("❌ Error fetching resume:", error);
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadResume(id);
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.name.replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Error downloading PDF", err);
      alert("Failed to download PDF.");
    }
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading resume...</p>;
  }

  if (!resume) {
    return <p className="p-6 text-center text-red-500">Resume not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{resume.name}'s Resume</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/resume/edit/${id}`)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={handleDownload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Download PDF
          </button>
        </div>
      </div>

      <p><strong>Email:</strong> {resume.email}</p>
      <p><strong>Phone:</strong> {resume.phone}</p>

      <h2 className="text-xl font-bold mt-6">Education</h2>
      <ul className="list-disc ml-6">
        {resume.education?.map((edu) => (
          <li key={edu.id}>
            {edu.degree} - {edu.college}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-6">Experience</h2>
      <ul className="list-disc ml-6">
        {resume.experience?.map((exp) => (
          <li key={exp.id}>
            {exp.title} at {exp.company}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumeView;
