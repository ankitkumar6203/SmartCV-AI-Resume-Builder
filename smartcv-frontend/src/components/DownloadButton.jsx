import React from "react";
import html2pdf from "html2pdf.js";

const DownloadButton = ({ elementId }) => {
  const handleDownload = () => {
    const element = document.getElementById(elementId);
    const opt = {
      margin: 0.5,
      filename: "SmartCV_Resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <button
      onClick={handleDownload}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Download PDF
    </button>
  );
};

export default DownloadButton;
