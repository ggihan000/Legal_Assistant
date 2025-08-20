package com.gigavision.legal_assistant.services;

import com.gigavision.legal_assistant.model.User;
import com.gigavision.legal_assistant.model.UserPrincipal;
import com.gigavision.legal_assistant.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class UserServices implements UserDetailsService {

    @Autowired
    private UserRepo repo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = repo.findByEmail(email);

        if (user == null) {
            System.out.println("no user found");
            throw new UsernameNotFoundException(email+" not found");
        }
        return new UserPrincipal(user);
    }



}
