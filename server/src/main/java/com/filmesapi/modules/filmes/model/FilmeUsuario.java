package com.filmesapi.modules.filmes.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.filmesapi.modules.auth.model.Usuario;
import java.time.LocalDateTime;

@Entity
@Table(name = "filmes_usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilmeUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "tmdb_id", nullable = false)
    private Long tmdbId;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "poster_path")
    private String posterPath;

    @Column(name = "ano_lancamento")
    private String anoLancamento;

    @Column(name = "generos")
    private String generos;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusFilme status;

    @Column(name = "nota_usuario")
    private Double notaUsuario;

    @Column(name = "data_adicao")
    private LocalDateTime dataAdicao;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @PrePersist
    protected void onCreate() {
        dataAdicao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
}
