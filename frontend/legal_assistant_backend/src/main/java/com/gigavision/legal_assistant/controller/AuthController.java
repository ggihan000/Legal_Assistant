package com.gigavision.legal_assistant.controller;

import com.gigavision.legal_assistant.model.User;
import com.gigavision.legal_assistant.services.AuthServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthServices authServices;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User newUser = new User();
            newUser.setFirstname(user.getFirstname());
            newUser.setPassword(user.getPassword());
            newUser.setEmail(user.getEmail());
            newUser.setReligion(user.getReligion());
            newUser.setKandyResident(user.getKandyResident());

            User registeredUser = authServices.register(newUser);
            String token = authServices.verify(user);

            Map<String, Object> response = new HashMap<>();
            response.put("id", registeredUser.getId());
            response.put("username", registeredUser.getUsername());
            response.put("email", registeredUser.getEmail());
            response.put("role", registeredUser.getRole()); // assuming role is an object
            response.put("token", token);

            return ResponseEntity.ok(response);


        } catch (RuntimeException e) {
            // Handle duplicate email
            System.out.println("error: "+e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));

        }catch (Exception e) {
            e.printStackTrace();
            System.out.println("error: "+e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try{
            String token = authServices.verify(user);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(Map.of("success", true,
                            "message", "Login successful",
                            "token", token));
        } catch (RuntimeException e) {
            // Handle invalid email password
            System.out.println("error: "+e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false,
                            "message", e.getMessage()));
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Internal server error"
                    ));
        }
    }
}