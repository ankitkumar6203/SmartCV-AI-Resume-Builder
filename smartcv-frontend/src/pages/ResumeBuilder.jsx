import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { saveResume } from "../api/resumeApi.js";
import { fetchAIResumeHelper } from "../api/aiApi"; // ✅ AI API

const ResumeBuilder = () => {
  const navigate = useNavigate();

  // Resume state
  const [resume, setResume] = useState({
    name: "",
    email: "",
    phone: "",
    education: [{ degree: "", college: "", year: "" }],
    experience: [{ title: "", company: "", duration: "" }],
    skills: "",
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  // ✅ Normalize AI response (array or string)
  const normalizeAIResponse = (field, res) => {
    let aiData = res?.response || "";

    // Convert plain string to array for list fields
    if (field === "experience") {
      if (Array.isArray(aiData)) {
        return aiData.map((exp) => ({
          title: exp.title || exp, // if string, use as title
          company: exp.company || "Company",
          duration: exp.duration || "Duration",
        }));
      }
      if (typeof aiData === "string") {
        return [
          { title: aiData, company: "Company", duration: "Duration" },
        ];
      }
    }

    if (field === "skills") {
      if (Array.isArray(aiData)) return aiData.join(", ");
      if (typeof aiData === "string") return aiData;
    }

    return aiData;
  };

  // ✅ Handle AI Suggest
  const handleAISuggest = async (field, prompt) => {
    try {
      setLoadingAI(true);
      const res = await fetchAIResumeHelper({ message: prompt });
      const formatted = normalizeAIResponse(field, res);
      setResume((prev) => ({ ...prev, [field]: formatted }));
    } catch (err) {
      alert("AI failed: " + err.message);
    } finally {
      setLoadingAI(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setResume({ ...resume, [name]: value.trimStart() });
  };

  const handleNestedChange = (e, index, section) => {
    const updated = [...resume[section]];
    updated[index][e.target.name] = e.target.value.trimStart();
    setResume({ ...resume, [section]: updated });
  };

  const getEmptySection = (section) =>
    section === "education"
      ? { degree: "", college: "", year: "" }
      : { title: "", company: "", duration: "" };

  const addField = (section) => {
    setResume({
      ...resume,
      [section]: [...resume[section], getEmptySection(section)],
    });
  };

  const removeField = (index, section) => {
    if (resume[section].length === 1) {
      alert(`At least one ${section} entry is required`);
      return;
    }
    const updated = [...resume[section]];
    updated.splice(index, 1);
    setResume({ ...resume, [section]: updated });
  };

  const validateForm = () => {
    if (!resume.name || !resume.email || !resume.phone) {
      alert("Please fill out your name, email, and phone.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await saveResume(resume);
      localStorage.setItem("resumeData", JSON.stringify(resume));
      navigate("/preview");
    } catch (error) {
      console.error("Error saving resume:", error);
      alert(
        error.response?.data?.message || "Failed to save resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Build Your Resume
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Personal Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={resume.name}
                onChange={handleChange}
                className="border rounded px-4 py-2"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={resume.email}
                onChange={handleChange}
                className="border rounded px-4 py-2"
                required
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={resume.phone}
                onChange={handleChange}
                className="border rounded px-4 py-2 md:col-span-2"
                required
              />
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Education</h2>
            {resume.education.map((edu, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 items-center"
              >
                <input
                  name="degree"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => handleNestedChange(e, index, "education")}
                  className="border rounded px-4 py-2"
                />
                <input
                  name="college"
                  placeholder="College"
                  value={edu.college}
                  onChange={(e) => handleNestedChange(e, index, "education")}
                  className="border rounded px-4 py-2"
                />
                <div className="flex gap-2">
                  <input
                    name="year"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => handleNestedChange(e, index, "education")}
                    className="border rounded px-4 py-2 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeField(index, "education")}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField("education")}
              className="text-blue-600 mt-2 text-sm"
            >
              + Add Education
            </button>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Experience</h2>
            {resume.experience.map((exp, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 items-center"
              >
                <input
                  name="title"
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => handleNestedChange(e, index, "experience")}
                  className="border rounded px-4 py-2"
                />
                <input
                  name="company"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleNestedChange(e, index, "experience")}
                  className="border rounded px-4 py-2"
                />
                <div className="flex gap-2">
                  <input
                    name="duration"
                    placeholder="Duration"
                    value={exp.duration}
                    onChange={(e) => handleNestedChange(e, index, "experience")}
                    className="border rounded px-4 py-2 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeField(index, "experience")}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() => addField("experience")}
                className="text-blue-600 text-sm"
              >
                + Add Experience
              </button>

              <button
                type="button"
                onClick={() =>
                  handleAISuggest(
                    "experience",
                    "Write an internship experience for a Java + React project"
                  )
                }
                className="bg-purple-600 text-white px-3 py-1 rounded"
                disabled={loadingAI}
              >
                {loadingAI ? "AI Thinking..." : "✨ AI Suggest"}
              </button>
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Skills</h2>
            <textarea
              name="skills"
              placeholder="E.g. HTML, CSS, React, Spring Boot"
              value={resume.skills}
              onChange={handleChange}
              className="border rounded px-4 py-2 w-full"
              rows={3}
            ></textarea>
            <button
              type="button"
              onClick={() =>
                handleAISuggest(
                  "skills",
                  "Suggest 5 technical + soft skills for a fresher full stack developer"
                )
              }
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
              disabled={loadingAI}
            >
              {loadingAI ? "AI Thinking..." : "✨ AI Suggest"}
            </button>
          </section>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg transition ${
                loading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Saving..." : "Save & Preview"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ResumeBuilder;
