import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { useReactToPrint } from "react-to-print";
import { saveResume } from "../api/resumeApi"; // ✅ import backend save API
import { downloadResume} from "../api/resumeApi";

// Resume Templates
import Template1 from "../components/templates/Template1";
import Template2 from "../components/templates/Template2";
import Template3 from "../components/templates/Template3";

// Template Picker Component
import TemplatePicker from "../components/TemplatePicker";

const ResumePreview = () => {
  const navigate = useNavigate();
  const resumeRef = useRef();
  const [resume, setResume] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");

  // Load resume data from localStorage
  useEffect(() => {
    const storedResume = localStorage.getItem("resumeData");
    if (storedResume) {
      setResume(JSON.parse(storedResume));
    } else {
      navigate("/resume/builder");
    }
  }, [navigate]);

  // Handle Save to Backend
  const handleSaveToDatabase = async () => {
    try {
      const response = await saveResume({
        ...resume,
        template: selectedTemplate, // optional extra field
        createdAt: new Date().toISOString(),
      });

      // ✅ Update local state + localStorage with backend response (has id)
      setResume(response);
      localStorage.setItem("resumeData", JSON.stringify(response));
      alert("Successfully Saved")
         // go to list page
    } catch (error) {
      alert("❌ Failed to save resume: " + error.message);
    }
  };

  // Handle PDF Download using html2pdf
  const handleDownloadPDF = () => {
    const element = resumeRef.current;
    const options = {
      margin: 0.5,
      filename: "SmartCV_Resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  // Handle Resume Print using react-to-print
  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    onAfterPrint: () => {
      console.log("✅ Printed successfully");
    },
    removeAfterPrint: true,
  });

  // Render selected template
  const renderSelectedTemplate = () => {
    if (!resume) return null;
    switch (selectedTemplate) {
      case "template2":
        return <Template2 resume={resume} />;
      case "template3":
        return <Template3 resume={resume} />;
      case "template1":
      default:
        return <Template1 resume={resume} />;
    }
  };

    const downloadResumePdf = async (id, name = "SmartCV_Resume") => {
    if (!id) {
      alert("⚠️ Please save your resume first before downloading as PDF.");
      return;
    }
    try {
      const blob = await downloadResume(id);
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Error downloading PDF:", error);
      alert("Failed to download PDF");
    }
  };

  if (!resume) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Template Picker */}
        <TemplatePicker
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
        />

        {/* Resume Preview */}
        <div ref={resumeRef} className="bg-white shadow-md rounded-md p-6 mt-4">
          {renderSelectedTemplate()}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => navigate("/resume/edit")}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Back to Edit
          </button>

          <button
            onClick={handleSaveToDatabase}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            Save to Database
          </button>

          <button
            onClick={() => downloadResumePdf(resume.id)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Download as PDF
          </button>

          <button
            onClick={async () => {
              const printFn = handlePrint();
              if (!printFn) {
                alert("❌ Printer unavailable");
              }
            }}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Print
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </button>

        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
