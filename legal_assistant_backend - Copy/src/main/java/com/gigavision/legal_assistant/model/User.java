package com.gigavision.legal_assistant.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;


@Data
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstname;
    @Column(nullable = false)
    private String lastname;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column
    private String religion;

    @Column
    private Boolean kandy_resident;

    @Column(nullable = false)
    private Long role_id;

    public String getPassword() {return password;}
    public void setPassword(String password) {this.password = password;}

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return email;
    }
    public String getFirstname(){return firstname;}
    public String getLastname(){return lastname;}
    public void setFirstname(String firstname) {this.firstname = firstname;}
    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public Long getRole() { return role_id; }
    public void setRole(Long role_id) { this.role_id = role_id; }

    public String getReligion() {
        return religion;
    }

    public void setReligion(String religion) {
        this.religion = religion;
    }

    public Boolean getKandyResident() {
        return kandy_resident;
    }

    public void setKandyResident(Boolean kandyResident) {
        this.kandy_resident = kandyResident;
    }
}
