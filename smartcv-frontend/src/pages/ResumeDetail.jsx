import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getResumeById } from "../api/resumeApi";

const ResumeDetail = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await getResumeById(id);
        console.log("✅ Resume from backend:", data);
        setResume(data); // no need to unwrap
      } catch (error) {
        console.error("❌ Error fetching resume:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  if (loading) return <p>Loading resume...</p>;
  if (!resume) return <p>Resume not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{resume.name}</h1>
      <p><strong>Email:</strong> {resume.email}</p>
      <p><strong>Phone:</strong> {resume.phone}</p>

      {/* Education */}
      {resume.education?.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Education</h2>
          <ul className="list-disc ml-6">
            {resume.education.map((edu) => (
              <li key={edu.id}>
                {edu.degree} @ {edu.college}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Experience */}
      {resume.experience?.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Experience</h2>
          <ul className="list-disc ml-6">
            {resume.experience.map((exp) => (
              <li key={exp.id}>
                {exp.title} at {exp.company}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeDetail;
