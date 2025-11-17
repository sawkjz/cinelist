package com.filmesapi.modules.reviews.model;

import jakarta.persistence.*;
import com.filmesapi.modules.auth.model.Usuario;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    public Usuario usuario;

    @Column(name = "tmdb_id", nullable = false)
    public Long tmdbId;

    @Column(name = "titulo_filme", nullable = false)
    public String tituloFilme;

    @Column(nullable = false)
    public Double nota;

    @Column(columnDefinition = "TEXT")
    public String comentario;

    @Column(name = "data_criacao")
    public LocalDateTime dataCriacao;

    @Column(name = "data_atualizacao")
    public LocalDateTime dataAtualizacao;

    public Review() {}

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
}
