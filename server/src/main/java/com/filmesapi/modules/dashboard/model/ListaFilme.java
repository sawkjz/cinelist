package com.filmesapi.modules.dashboard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "lista_filmes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListaFilme {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lista_id", nullable = false)
    private Lista lista;
    
    @Column(name = "tmdb_id", nullable = false)
    private Long tmdbId;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(name = "poster_path")
    private String posterPath;
    
    @Column(name = "ano_lancamento")
    private String anoLancamento;
    
    private Double nota;
    
    private String generos;
    
    @Column(name = "data_adicao")
    private LocalDateTime dataAdicao;
    
    @PrePersist
    protected void onCreate() {
        dataAdicao = LocalDateTime.now();
        System.out.println("🎬 [ListaFilme] Adicionando filme '" + titulo + "' (TMDB ID: " + tmdbId + ") à lista ID: " + lista.getId());
    }
}
