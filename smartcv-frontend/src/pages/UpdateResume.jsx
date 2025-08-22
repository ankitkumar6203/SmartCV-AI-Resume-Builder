import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResumeById, updateResume } from "../api/resumeApi";

const UpdateResume = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await getResumeById(id);
        // Ensure education & experience are arrays
        setResume({
          ...data,
          education: data.education || [],
          experience: data.experience || [],
        });
      } catch (error) {
        console.error("Error fetching resume:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  const handleChange = (e) => {
    setResume({ ...resume, [e.target.name]: e.target.value });
  };

  const handleEducationChange = (index, e) => {
    const updatedEducation = [...resume.education];
    updatedEducation[index][e.target.name] = e.target.value;
    setResume({ ...resume, education: updatedEducation });
  };

  const handleExperienceChange = (index, e) => {
    const updatedExperience = [...resume.experience];
    updatedExperience[index][e.target.name] = e.target.value;
    setResume({ ...resume, experience: updatedExperience });
  };

  const addEducation = () => {
    setResume({
      ...resume,
      education: [...resume.education, { degree: "", college: "", year: "" }],
    });
  };

  const addExperience = () => {
    setResume({
      ...resume,
      experience: [...resume.experience, { title: "", company: "", years: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateResume(id, resume);
      alert("Resume updated successfully!");
      navigate("/resumes");
    } catch (error) {
      console.error("Error updating resume:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!resume) return <p>Resume not found</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Resume</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={resume.name || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={resume.email || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={resume.phone || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Education Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Education</h2>
          {resume.education.map((edu, idx) => (
            <div key={idx} className="mb-3 p-3 border rounded">
              <input
                type="text"
                name="degree"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => handleEducationChange(idx, e)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                name="college"
                placeholder="College"
                value={edu.college}
                onChange={(e) => handleEducationChange(idx, e)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                name="year"
                placeholder="Year"
                value={edu.year}
                onChange={(e) => handleEducationChange(idx, e)}
                className="w-full border p-2 rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addEducation}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            + Add Education
          </button>
        </div>

        {/* Experience Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Experience</h2>
          {resume.experience.map((exp, idx) => (
            <div key={idx} className="mb-3 p-3 border rounded">
              <input
                type="text"
                name="title"
                placeholder="Job Title"
                value={exp.title}
                onChange={(e) => handleExperienceChange(idx, e)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => handleExperienceChange(idx, e)}
                className="w-full border p-2 rounded mb-2"
              />
              <input
                type="text"
                name="years"
                placeholder="Years"
                value={exp.years}
                onChange={(e) => handleExperienceChange(idx, e)}
                className="w-full border p-2 rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addExperience}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            + Add Experience
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Update Resume
        </button>
      </form>
    </div>
  );
};

export default UpdateResume;
