package com.smartcv.smartcv_backend.resume;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResumeDto {
    private Long id;
    private String name;
    private String email;
    private String summary;
}

