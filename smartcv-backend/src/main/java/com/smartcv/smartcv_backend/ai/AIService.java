package com.smartcv.smartcv_backend.ai;

import com.theokanning.openai.service.OpenAiService;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Collections;

@Service
public class AIService {

    private final OpenAiService openAiService;

    public AIService(@Value("${openai.api.key}") String apiKey) {
        // ✅ Ensure no hidden characters (spaces, newlines) in the key
        String cleanedKey = apiKey.trim();
        if (cleanedKey.isEmpty() || cleanedKey.startsWith("dummy")) {
            throw new IllegalArgumentException("❌ Invalid OpenAI API Key. Please check your .env or environment variables.");
        }
        this.openAiService = new OpenAiService(cleanedKey, Duration.ofSeconds(60));
    }

    public String getAIResponse(String userMessage) {
        try {
            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model("gpt-4o-mini") // ✅ lightweight and fast
                    .messages(Collections.singletonList(new ChatMessage("user", userMessage)))
                    .maxTokens(500)
                    .temperature(0.7)
                    .build();

            ChatCompletionResult result = openAiService.createChatCompletion(request);

            if (result.getChoices() != null && !result.getChoices().isEmpty()) {
                return result.getChoices().get(0).getMessage().getContent();
            } else {
                return "⚠️ AI returned no response. Try again.";
            }
        } catch (Exception e) {
            e.printStackTrace(); // logs the full error in backend
            return "❌ Error contacting AI service. Please check backend logs.";
        }
    }
}
