import React from "react";

const Template1 = ({ resume }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
      {/* Name */}
      <h1 className="text-3xl font-bold text-center mb-2">
        {resume?.name || "Your Name"}
      </h1>

      {/* Contact */}
      <p className="text-center text-gray-600 mb-4">
        {resume?.email || "email@example.com"}{" "}
        {resume?.phone && <>| {resume.phone}</>}
      </p>

      {/* Education */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold border-b pb-1 mb-2">Education</h2>
        {resume?.education?.length > 0 ? (
          resume.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <p className="font-medium">
                {edu.degree || "Degree"} - {edu.college || "College Name"}
              </p>
              <p className="text-sm text-gray-600">
                {edu.year || "Year"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No education details provided.</p>
        )}
      </section>

      {/* Experience */}
      <section className="mb-6">
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
          <p className="text-gray-500 text-sm">No work experience provided.</p>
        )}
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-xl font-semibold border-b pb-1 mb-2">Skills</h2>
        {resume?.skills ? (
          <p>{resume.skills}</p>
        ) : (
          <p className="text-gray-500 text-sm">No skills added.</p>
        )}
      </section>
    </div>
  );
};

export default Template1;
