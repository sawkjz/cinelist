package com.filmesapi.modules.filmes.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class TMDBService {

    private final WebClient webClient;
    
    @Value("${tmdb.api.key}")
    private String apiKey;

    public TMDBService(WebClient tmdbWebClient) {
        this.webClient = tmdbWebClient;
    }

    public Mono<String> searchMovies(String query, int page) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/movie")
                        .queryParam("query", query)
                        .queryParam("page", page)
                        .queryParam("language", "pt-BR")
                        .build())
                .header("Authorization", "Bearer " + apiKey)
                .retrieve()
                .bodyToMono(String.class);
    }

    public Mono<String> getPopularMovies(int page) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/popular")
                        .queryParam("page", page)
                        .queryParam("language", "pt-BR")
                        .build())
                .header("Authorization", "Bearer " + apiKey)
                .retrieve()
                .bodyToMono(String.class);
    }

    public Mono<String> getMovieDetails(Long tmdbId) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/movie/{id}")
                        .queryParam("language", "pt-BR")
                        .build(tmdbId))
                .header("Authorization", "Bearer " + apiKey)
                .retrieve()
                .bodyToMono(String.class);
    }

    public Mono<String> getTrendingMovies(int page) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/trending/movie/week")
                        .queryParam("page", page)
                        .queryParam("language", "pt-BR")
                        .build())
                .header("Authorization", "Bearer " + apiKey)
                .retrieve()
                .bodyToMono(String.class);
    }
}
