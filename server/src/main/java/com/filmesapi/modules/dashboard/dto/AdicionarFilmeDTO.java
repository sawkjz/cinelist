package com.filmesapi.modules.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdicionarFilmeDTO {
    private Long listaId;
    private Long tmdbId;
    private String titulo;
    private String posterPath;
    private String anoLancamento;
    private Double nota;
    private String generos;
}
