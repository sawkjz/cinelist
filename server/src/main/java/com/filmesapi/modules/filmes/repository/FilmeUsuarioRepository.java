package com.filmesapi.modules.filmes.repository;

import com.filmesapi.modules.filmes.model.FilmeUsuario;
import com.filmesapi.modules.filmes.model.StatusFilme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FilmeUsuarioRepository extends JpaRepository<FilmeUsuario, Long> {
    List<FilmeUsuario> findByUsuarioId(Long usuarioId);
    List<FilmeUsuario> findByUsuarioIdAndStatus(Long usuarioId, StatusFilme status);
    Optional<FilmeUsuario> findByUsuarioIdAndTmdbId(Long usuarioId, Long tmdbId);
    boolean existsByUsuarioIdAndTmdbId(Long usuarioId, Long tmdbId);
}
