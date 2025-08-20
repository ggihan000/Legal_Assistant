package com.gigavision.legal_assistant.model;
import java.io.*;
import java.util.function.Consumer;

public class PythonRunner {
    public static void runPythonScript(String scriptPath, Consumer<String> outputConsumer,String jsonChat, String... args) throws Exception {
        // Build command: python <script_path> <arguments>
        String[] command = new String[args.length + 2];
        command[0] = "python"; // Use "python3" on Linux/macOS if needed
        command[1] = scriptPath;
        System.arraycopy(args, 0, command, 2, args.length);

        ProcessBuilder pb = new ProcessBuilder(command);
        pb.redirectErrorStream(true); // Merge error stream with standard output

        Process process = pb.start();


        try (OutputStream os = process.getOutputStream();
             BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os))) {
            writer.write(jsonChat);
            writer.flush();  // Ensure all data is sent
        }
        // Read output
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {

            String line;
            while ((line = reader.readLine()) != null) {
                // Send each line to the consumer
                outputConsumer.accept(line);
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException(
                    "Python script exited with code: " + exitCode
            );
        }
    }
}
