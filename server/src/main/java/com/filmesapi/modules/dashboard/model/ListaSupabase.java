package com.filmesapi.modules.dashboard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "profile_movies_favlist", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListaSupabase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    
    @Column(name = "list_name", nullable = false)
    private String listName;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "favlist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ListaFilmeSupabase> movies = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        System.out.println("📝 [ListaSupabase] Criando nova lista: " + listName + " para usuário: " + userId);
    }
}
