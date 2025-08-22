import React from "react";

const TemplatePicker = ({ selectedTemplate, setSelectedTemplate }) => {
  const templates = [
    { value: "template1", label: "Template 1 - Clean" },
    { value: "template2", label: "Template 2 - Sidebar" },
    { value: "template3", label: "Template 3 - Two Column" },
  ];

  return (
    <div className="flex items-center justify-end mb-4">
      <label
        htmlFor="template"
        className="mr-2 text-sm font-medium text-gray-700"
      >
        Choose Template:
      </label>
      <select
        id="template"
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value)}
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200"
      >
        {templates.map((template) => (
          <option key={template.value} value={template.value}>
            {template.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TemplatePicker;
