package com.filmesapi.modules.reviews.dto;

public class ReviewRequest {
    public Long tmdbId;
    public String tituloFilme;
    public Double nota;
    public String comentario;
    
    public ReviewRequest() {}
    
    public ReviewRequest(Long tmdbId, String tituloFilme, Double nota, String comentario) {
        this.tmdbId = tmdbId;
        this.tituloFilme = tituloFilme;
        this.nota = nota;
        this.comentario = comentario;
    }
}
