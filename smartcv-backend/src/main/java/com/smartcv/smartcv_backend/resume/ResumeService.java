package com.smartcv.smartcv_backend.resume;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;


@Service
@RequiredArgsConstructor
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    // ✅ Get all resumes
    public List<Resume> getAllResumes() {
        return resumeRepository.findAll();
    }

    public byte[] generateResumePdf(Long id) {
        Resume resume = getResumeById(id);
        if (resume == null) return null;

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, out);

            document.open();
            document.add(new Paragraph("Resume"));
            document.add(new Paragraph("Name: " + resume.getName()));
            document.add(new Paragraph("Email: " + resume.getEmail()));
            document.add(new Paragraph("Phone: " + resume.getPhone()));

            // ✅ Education section
            document.add(new Paragraph("\nEducation:"));
            if (resume.getEducation() != null) {
                for (Education edu : resume.getEducation()) {
                    document.add(new Paragraph(
                            edu.getDegree() + " - " + edu.getCollege() + " (" + edu.getYear() + ")"
                    ));
                }
            }

            // ✅ Experience section
            document.add(new Paragraph("\nExperience:"));
            if (resume.getExperience() != null) {
                for (Experience exp : resume.getExperience()) {
                    document.add(new Paragraph(
                            exp.getTitle() + " at " + exp.getCompany() + " (" + exp.getDuration() + ")"
                    ));
                }
            }

            document.close();
            return out.toByteArray();

        } catch (Exception e) {   // ✅ catch DocumentException + IOException
            e.printStackTrace();
            return null;
        }
    }
    // ✅ Get resume by ID
    public Resume getResumeById(Long id) {
        return resumeRepository.findById(id).orElse(null);
    }

    // ✅ Save or update resume
    public Resume saveResume(Resume resume) {
        return resumeRepository.save(resume);
    }

    // ✅ Delete resume
    public void deleteResume(Long id) {
        resumeRepository.deleteById(id);
    }

}
