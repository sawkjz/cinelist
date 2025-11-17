package com.filmesapi.modules.reviews.service;

import com.filmesapi.modules.auth.model.Usuario;
import com.filmesapi.modules.auth.repository.UsuarioRepository;
import com.filmesapi.modules.reviews.dto.ReviewRequest;
import com.filmesapi.modules.reviews.dto.ReviewResponse;
import com.filmesapi.modules.reviews.model.Review;
import com.filmesapi.modules.reviews.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UsuarioRepository usuarioRepository;

    public ReviewService(ReviewRepository reviewRepository, UsuarioRepository usuarioRepository) {
        this.reviewRepository = reviewRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public ReviewResponse createOrUpdateReview(Long usuarioId, ReviewRequest request) {
        if (usuarioId == null || request.tmdbId == null) {
            throw new IllegalArgumentException("Usuario ID e TMDB ID são obrigatórios");
        }
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Optional<Review> existingReview = reviewRepository.findByUsuarioIdAndTmdbId(usuarioId, request.tmdbId);

        Review review;
        if (existingReview.isPresent()) {
            review = existingReview.get();
            review.nota = request.nota;
            review.comentario = request.comentario;
            review.tituloFilme = request.tituloFilme;
        } else {
            review = new Review();
            review.usuario = usuario;
            review.tmdbId = request.tmdbId;
            review.tituloFilme = request.tituloFilme;
            review.nota = request.nota;
            review.comentario = request.comentario;
        }

        Review savedReview = reviewRepository.save(review);
        return toResponse(savedReview);
    }

    public List<ReviewResponse> getReviewsByMovie(Long tmdbId) {
        return reviewRepository.findByTmdbId(tmdbId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ReviewResponse> getReviewsByUser(Long usuarioId) {
        return reviewRepository.findByUsuarioId(usuarioId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteReview(Long reviewId, Long usuarioId) {
        if (reviewId == null || usuarioId == null) {
            throw new IllegalArgumentException("Review ID e Usuario ID são obrigatórios");
        }
        
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review não encontrada"));

        Usuario usuario = review.usuario;
        if (usuario == null || usuario.getId() == null || !usuario.getId().equals(usuarioId)) {
            throw new RuntimeException("Você não tem permissão para deletar esta review");
        }

        reviewRepository.delete(review);
    }

    private ReviewResponse toResponse(Review review) {
        Usuario usuario = review.usuario;
        return new ReviewResponse(
                review.id,
                usuario.getId(),
                usuario.getEmail(),
                review.tmdbId,
                review.tituloFilme,
                review.nota,
                review.comentario,
                review.dataCriacao,
                review.dataAtualizacao
        );
    }
}
