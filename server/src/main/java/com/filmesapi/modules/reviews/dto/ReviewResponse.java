package com.filmesapi.modules.reviews.dto;

import java.time.LocalDateTime;

public class ReviewResponse {
    public Long id;
    public Long usuarioId;
    public String nomeUsuario;
    public String avatarUrl;
    public Long tmdbId;
    public String tituloFilme;
    public Double nota;
    public String comentario;
    public LocalDateTime dataCriacao;
    public LocalDateTime dataAtualizacao;
    
    public ReviewResponse() {}
    
    public ReviewResponse(Long id, Long usuarioId, String nomeUsuario, Long tmdbId,
                         String tituloFilme, Double nota, String comentario,
                         LocalDateTime dataCriacao, LocalDateTime dataAtualizacao, String avatarUrl) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.nomeUsuario = nomeUsuario;
        this.tmdbId = tmdbId;
        this.tituloFilme = tituloFilme;
        this.nota = nota;
        this.comentario = comentario;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.avatarUrl = avatarUrl;
    }
}
