package com.filmesapi.modules.filmes.controller;

import com.filmesapi.modules.filmes.service.TMDBService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/filmes")
public class FilmeController {

    private final TMDBService tmdbService;

    public FilmeController(TMDBService tmdbService) {
        this.tmdbService = tmdbService;
    }

    @GetMapping("/search")
    public Mono<ResponseEntity<String>> searchMovies(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        return tmdbService.searchMovies(query, page)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/popular")
    public Mono<ResponseEntity<String>> getPopularMovies(
            @RequestParam(defaultValue = "1") int page) {
        return tmdbService.getPopularMovies(page)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/trending")
    public Mono<ResponseEntity<String>> getTrendingMovies(
            @RequestParam(defaultValue = "1") int page) {
        return tmdbService.getTrendingMovies(page)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/{tmdbId}")
    public Mono<ResponseEntity<String>> getMovieDetails(@PathVariable Long tmdbId) {
        return tmdbService.getMovieDetails(tmdbId)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/now-playing")
    public Mono<ResponseEntity<String>> getNowPlayingMovies(
            @RequestParam(defaultValue = "1") int page) {
        return tmdbService.getNowPlayingMovies(page)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/genre/{genreId}")
    public Mono<ResponseEntity<String>> getMoviesByGenre(
            @PathVariable int genreId,
            @RequestParam(defaultValue = "1") int page) {
        return tmdbService.getMoviesByGenre(genreId, page)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/genres")
    public Mono<ResponseEntity<String>> getGenreList() {
        return tmdbService.getGenreList()
                .map(ResponseEntity::ok);
    }
}
