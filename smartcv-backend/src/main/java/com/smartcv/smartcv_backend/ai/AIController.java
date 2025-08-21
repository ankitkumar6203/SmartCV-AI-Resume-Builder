package com.smartcv.smartcv_backend.ai;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173") // React frontend
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/resume-helper")
    public ResponseEntity<Map<String, String>> getAIResponse(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        String aiResponse = aiService.getAIResponse(userMessage);

        Map<String, String> response = new HashMap<>();
        response.put("response", aiResponse);

        return ResponseEntity.ok(response);
    }

}
