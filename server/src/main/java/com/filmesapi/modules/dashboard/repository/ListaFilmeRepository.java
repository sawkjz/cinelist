package com.filmesapi.modules.dashboard.repository;

import com.filmesapi.modules.dashboard.model.ListaFilme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ListaFilmeRepository extends JpaRepository<ListaFilme, Long> {
    
    List<ListaFilme> findByListaId(Long listaId);
    
    Optional<ListaFilme> findByListaIdAndTmdbId(Long listaId, Long tmdbId);
    
    boolean existsByListaIdAndTmdbId(Long listaId, Long tmdbId);
    
    void deleteByListaIdAndTmdbId(Long listaId, Long tmdbId);
}
