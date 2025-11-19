package com.filmesapi.modules.dashboard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "profile_movies_favlist_movies", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListaFilmeSupabase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "favlist_id", nullable = false)
    private ListaSupabase favlist;
    
    @Column(name = "movie_id", nullable = false)
    private Long movieId;
    
    @Column(name = "added_at")
    private LocalDateTime addedAt;
    
    @PrePersist
    protected void onCreate() {
        addedAt = LocalDateTime.now();
        System.out.println("🎬 [ListaFilmeSupabase] Adicionando filme (Movie ID: " + movieId + ") à lista ID: " + favlist.getId());
    }
}
