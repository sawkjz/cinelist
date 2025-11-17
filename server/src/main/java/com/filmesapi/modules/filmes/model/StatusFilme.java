package com.filmesapi.modules.filmes.model;

public enum StatusFilme {
    ASSISTINDO("Assistindo"),
    COMPLETO("Completo"),
    PLANEJADO("Planejado"),
    ABANDONADO("Abandonado");

    private final String descricao;

    StatusFilme(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
