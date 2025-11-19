package com.filmesapi.modules.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilmeListaDTO {
    private Long id;
    private Long tmdbId;
    private String titulo;
    private String posterPath;
    private String anoLancamento;
    private Double nota;
    private String generos;
    private LocalDateTime dataAdicao;
}
