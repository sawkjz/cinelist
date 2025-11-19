package com.filmesapi.modules.dashboard.repository;

import com.filmesapi.modules.dashboard.model.Lista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ListaRepository extends JpaRepository<Lista, Long> {
    
    List<Lista> findByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);
    
    Optional<Lista> findByIdAndUsuarioId(Long id, Long usuarioId);
    
    @Query("SELECT l FROM Lista l LEFT JOIN FETCH l.filmes WHERE l.usuarioId = :usuarioId ORDER BY l.dataCriacao DESC")
    List<Lista> findByUsuarioIdWithFilmes(Long usuarioId);
    
    boolean existsByNomeAndUsuarioId(String nome, Long usuarioId);
}
