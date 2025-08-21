package com.smartcv.smartcv_backend.resume;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String degree;
    private String college;
    private String year;

    @ManyToOne
    @JoinColumn(name = "resume_id")
    @JsonBackReference   // ✅ Prevents infinite loop
    private Resume resume;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }
}
