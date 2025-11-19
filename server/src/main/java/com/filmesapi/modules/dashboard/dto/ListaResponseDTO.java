package com.filmesapi.modules.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListaResponseDTO {
    private Long id;
    private String nome;
    private String descricao;
    private Long usuarioId;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    private List<FilmeListaDTO> filmes;
    private Integer totalFilmes;
}
