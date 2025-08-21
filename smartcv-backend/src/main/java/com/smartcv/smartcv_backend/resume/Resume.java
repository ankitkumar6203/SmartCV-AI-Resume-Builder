package com.smartcv.smartcv_backend.resume;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "resume")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;

    @CreationTimestamp  // ✅ Auto-set when inserted
    private LocalDateTime createdAt;

    // ✅ Manage JSON serialization properly
    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Education> education;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Experience> experience;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public List<Education> getEducation() { return education; }
    public void setEducation(List<Education> education) {
        this.education = education;
        if (education != null) {
            education.forEach(e -> e.setResume(this));
        }
    }

    public List<Experience> getExperience() { return experience; }
    public void setExperience(List<Experience> experience) {
        this.experience = experience;
        if (experience != null) {
            experience.forEach(e -> e.setResume(this));
        }
    }

}
