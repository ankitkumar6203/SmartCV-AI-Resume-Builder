import React from "react";

const Template2 = ({ resume }) => {
  return (
    <div className="flex border rounded shadow bg-white max-w-4xl mx-auto">
      {/* Sidebar */}
      <div className="w-1/3 bg-blue-100 p-6">
        <h1 className="text-2xl font-bold">{resume?.name || "Your Name"}</h1>
        <p className="text-sm text-gray-700 mt-1">
          {resume?.email || "email@example.com"}
        </p>
        {resume?.phone && (
          <p className="text-sm text-gray-700">{resume.phone}</p>
        )}

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Skills</h2>
          {resume?.skills ? (
            <p className="text-sm">{resume.skills}</p>
          ) : (
            <p className="text-gray-500 text-sm">No skills added.</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-6">
        {/* Education */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">Education</h2>
          {resume?.education?.length > 0 ? (
            resume.education.map((edu, index) => (
              <div key={index} className="mb-2">
                <p className="font-medium">
                  {edu.degree || "Degree"} - {edu.college || "College"}
                </p>
                <p className="text-sm text-gray-600">
                  {edu.year || "Year"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No education details provided.
            </p>
          )}
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">Experience</h2>
          {resume?.experience?.length > 0 ? (
            resume.experience.map((exp, index) => (
              <div key={index} className="mb-2">
                <p className="font-medium">
                  {exp.title || "Job Title"} at {exp.company || "Company"}
                </p>
                <p className="text-sm text-gray-600">
                  {exp.duration || "Duration"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No work experience provided.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template2;
