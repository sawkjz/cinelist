package com.filmesapi.modules.auth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private String nome;

    @Column(name = "external_id", unique = true)
    private String externalId;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
    
    // Manual getters for compilation compatibility
    public Long getId() {
        return id;
    }
    
    public String getEmail() {
        return email;
    }

    public String getNome() {
        return nome;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public String getExternalId() {
        return externalId;
    }
}
