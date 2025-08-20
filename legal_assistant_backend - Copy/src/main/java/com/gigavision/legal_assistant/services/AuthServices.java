package com.gigavision.legal_assistant.services;

import com.gigavision.legal_assistant.model.User;
import com.gigavision.legal_assistant.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

//handle services related to authentication
@Service
public class AuthServices {

    @Autowired
    private UserRepo repo;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    //register new user
    public User register(User user) {
        System.out.println(user.getUsername());
        if (repo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User already exists with this email");
        }
        user.setRole(3L);
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }

    //verify user details
    public String verify(User user) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(user.getEmail());
        }
        throw new RuntimeException("Bad credentials");
    }

    public String validateToken(String token) {
        //todo
        return "hi";
    }
}
