package com.gigavision.legal_assistant.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @GetMapping("/test")
    public String test() {
        return "api call successful";
    }

}
