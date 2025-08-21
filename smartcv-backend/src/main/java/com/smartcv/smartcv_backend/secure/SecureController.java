package com.smartcv.smartcv_backend.secure;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/secure")
@CrossOrigin(origins = "*")
public class SecureController {

    @GetMapping("/hello")
    public String hello() {
        return "You are authenticated!";
    }
}
