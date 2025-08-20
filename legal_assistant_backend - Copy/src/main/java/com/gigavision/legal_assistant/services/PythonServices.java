package com.gigavision.legal_assistant.services;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gigavision.legal_assistant.model.PythonRunner;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

@Service
public class PythonServices {
    public void executePythonScript(List<Map<String, String>> chat, Consumer<String> outputHandler) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        String jsonInput = mapper.writeValueAsString(chat);
        System.out.println(jsonInput);
        try {
            String scriptPath = "legal-assistant/test.py";
            PythonRunner.runPythonScript(scriptPath,outputHandler,jsonInput);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
