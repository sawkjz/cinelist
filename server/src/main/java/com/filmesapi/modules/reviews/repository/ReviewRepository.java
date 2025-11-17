package com.filmesapi.modules.reviews.repository;

import com.filmesapi.modules.reviews.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUsuarioId(Long usuarioId);
    List<Review> findByTmdbId(Long tmdbId);
    Optional<Review> findByUsuarioIdAndTmdbId(Long usuarioId, Long tmdbId);
}
