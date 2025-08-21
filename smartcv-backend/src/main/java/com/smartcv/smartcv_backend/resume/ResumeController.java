package com.smartcv.smartcv_backend.resume;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resume")   // ✅ Base path for all resume endpoints
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
//@CrossOrigin(origins = "*")      // ✅ Allow frontend calls
public class ResumeController {

    private final ResumeService resumeService;


    // ✅ Get all resumes
    @GetMapping("/all")
    public ResponseEntity<List<Resume>> getAllResumes() {
        return ResponseEntity.ok(resumeService.getAllResumes());
    }

    // ✅ Get resume by ID
    @GetMapping("/{id}")
    public Resume getResumeById(@PathVariable Long id) {
        return resumeService.getResumeById(id);
    }


    // ✅ Create resume
    @PostMapping
    public Resume createResume(@RequestBody Resume resume) {
        return resumeService.saveResume(resume);
    }

    // ✅ Update resume
    @PutMapping("/{id}")
    public Resume updateResume(@PathVariable Long id, @RequestBody Resume resume) {
        resume.setId(id);
        return resumeService.saveResume(resume);
    }

    // ✅ Delete resume
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResume(@PathVariable Long id) {
        resumeService.deleteResume(id);
        return ResponseEntity.ok("Resume deleted successfully");
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<Resume> viewResumeById(@PathVariable Long id) {
        Resume resume = resumeService.getResumeById(id);
        if (resume != null) {
            return ResponseEntity.ok(resume);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Long id) {
        byte[] pdfBytes = resumeService.generateResumePdf(id);
        if (pdfBytes == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"resume_" + id + ".pdf\"")
                .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

}
