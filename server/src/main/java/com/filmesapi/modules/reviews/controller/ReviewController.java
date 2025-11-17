package com.filmesapi.modules.reviews.controller;

import com.filmesapi.modules.reviews.dto.ReviewRequest;
import com.filmesapi.modules.reviews.dto.ReviewResponse;
import com.filmesapi.modules.reviews.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "${app.cors.allowed-origin}")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<ReviewResponse> createOrUpdateReview(
            @PathVariable Long usuarioId,
            @RequestBody ReviewRequest request) {
        try {
            ReviewResponse response = reviewService.createOrUpdateReview(usuarioId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/filme/{tmdbId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByMovie(@PathVariable Long tmdbId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByMovie(tmdbId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByUser(@PathVariable Long usuarioId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByUser(usuarioId);
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{reviewId}/usuario/{usuarioId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            @PathVariable Long usuarioId) {
        try {
            reviewService.deleteReview(reviewId, usuarioId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
