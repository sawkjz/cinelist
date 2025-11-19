package com.filmesapi.modules.auth.dto;

public class UsuarioSyncResponse {
    public Long id;
    public String email;
    public String nome;
    public String avatarUrl;

    public UsuarioSyncResponse() {}

    public UsuarioSyncResponse(Long id, String email, String nome, String avatarUrl) {
        this.id = id;
        this.email = email;
        this.nome = nome;
        this.avatarUrl = avatarUrl;
    }
}
