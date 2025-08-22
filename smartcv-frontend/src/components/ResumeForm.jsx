import React, { useState } from "react";
import { saveResume } from "../api/resumeApi";

export default function ResumeForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: [{ degree: "", college: "", year: "" }],
    experience: [{ title: "", company: "", duration: "" }]
  });
  const [loading, setLoading] = useState(false);

  // Handle top-level field changes
  const handleTopLevelChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle section field changes
  const handleSectionChange = (e, index, section) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = [...prev[section]];
      updated[index][name] = value;
      return { ...prev, [section]: updated };
    });
  };

  const addField = (section) => {
    const emptyItem =
      section === "education"
        ? { degree: "", college: "", year: "" }
        : { title: "", company: "", duration: "" };

    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], emptyItem]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveResume(formData);
      alert("✅ Resume saved successfully!");
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        education: [{ degree: "", college: "", year: "" }],
        experience: [{ title: "", company: "", duration: "" }]
      });
    } catch (err) {
      console.error("❌ Save failed:", err);
      alert(
        `Failed to save resume: ${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleTopLevelChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleTopLevelChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleTopLevelChange}
        className="border p-2 w-full"
      />

      <h3 className="font-bold">Education</h3>
      {formData.education.map((edu, idx) => (
        <div key={idx} className="space-x-2">
          <input
            name="degree"
            placeholder="Degree"
            value={edu.degree}
            onChange={(e) => handleSectionChange(e, idx, "education")}
            className="border p-2"
          />
          <input
            name="college"
            placeholder="College"
            value={edu.college}
            onChange={(e) => handleSectionChange(e, idx, "education")}
            className="border p-2"
          />
          <input
            name="year"
            placeholder="Year"
            value={edu.year}
            onChange={(e) => handleSectionChange(e, idx, "education")}
            className="border p-2"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => addField("education")}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Add Education
      </button>

      <h3 className="font-bold">Experience</h3>
      {formData.experience.map((exp, idx) => (
        <div key={idx} className="space-x-2">
          <input
            name="title"
            placeholder="Title"
            value={exp.title}
            onChange={(e) => handleSectionChange(e, idx, "experience")}
            className="border p-2"
          />
          <input
            name="company"
            placeholder="Company"
            value={exp.company}
            onChange={(e) => handleSectionChange(e, idx, "experience")}
            className="border p-2"
          />
          <input
            name="duration"
            placeholder="Duration"
            value={exp.duration}
            onChange={(e) => handleSectionChange(e, idx, "experience")}
            className="border p-2"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => addField("experience")}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        Add Experience
      </button>

      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Resume"}
      </button>
    </form>
  );
}
