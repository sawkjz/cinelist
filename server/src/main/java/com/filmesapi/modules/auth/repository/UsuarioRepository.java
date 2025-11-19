package com.filmesapi.modules.auth.repository;

import com.filmesapi.modules.auth.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByExternalId(String externalId);
    boolean existsByEmail(String email);
}
