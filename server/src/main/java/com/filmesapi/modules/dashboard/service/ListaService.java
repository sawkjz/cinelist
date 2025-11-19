package com.filmesapi.modules.dashboard.service;

import com.filmesapi.modules.dashboard.dto.*;
import com.filmesapi.modules.dashboard.model.Lista;
import com.filmesapi.modules.dashboard.model.ListaFilme;
import com.filmesapi.modules.dashboard.repository.ListaFilmeRepository;
import com.filmesapi.modules.dashboard.repository.ListaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListaService {
    
    private final ListaRepository listaRepository;
    private final ListaFilmeRepository listaFilmeRepository;
    
    public List<ListaResponseDTO> buscarListasDoUsuario(Long usuarioId) {
        System.out.println("🔍 [ListaService] Buscando listas do usuário ID: " + usuarioId);
        
        List<Lista> listas = listaRepository.findByUsuarioIdWithFilmes(usuarioId);
        
        System.out.println("✅ [ListaService] Encontradas " + listas.size() + " listas");
        
        return listas.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ListaResponseDTO criarLista(Long usuarioId, CriarListaDTO dto) {
        System.out.println("➕ [ListaService] Criando nova lista '" + dto.getNome() + "' para usuário ID: " + usuarioId);
        
        // Verificar se já existe lista com mesmo nome
        if (listaRepository.existsByNomeAndUsuarioId(dto.getNome(), usuarioId)) {
            System.out.println("❌ [ListaService] Já existe uma lista com o nome: " + dto.getNome());
            throw new RuntimeException("Já existe uma lista com este nome");
        }
        
        Lista lista = new Lista();
        lista.setNome(dto.getNome());
        lista.setDescricao(dto.getDescricao());
        lista.setUsuarioId(usuarioId);
        
        Lista listaSalva = listaRepository.save(lista);
        
        System.out.println("✅ [ListaService] Lista criada com sucesso - ID: " + listaSalva.getId());
        
        return convertToDTO(listaSalva);
    }
    
    @Transactional
    public void adicionarFilmeNaLista(Long usuarioId, AdicionarFilmeDTO dto) {
        System.out.println("➕ [ListaService] Adicionando filme '" + dto.getTitulo() + "' (TMDB: " + dto.getTmdbId() + ") à lista ID: " + dto.getListaId());
        
        // Buscar lista e verificar se pertence ao usuário
        Lista lista = listaRepository.findByIdAndUsuarioId(dto.getListaId(), usuarioId)
                .orElseThrow(() -> {
                    System.out.println("❌ [ListaService] Lista não encontrada ou não pertence ao usuário");
                    return new RuntimeException("Lista não encontrada");
                });
        
        // Verificar se o filme já está na lista
        if (listaFilmeRepository.existsByListaIdAndTmdbId(dto.getListaId(), dto.getTmdbId())) {
            System.out.println("⚠️ [ListaService] Filme já existe na lista");
            throw new RuntimeException("Filme já existe nesta lista");
        }
        
        ListaFilme listaFilme = new ListaFilme();
        listaFilme.setLista(lista);
        listaFilme.setTmdbId(dto.getTmdbId());
        listaFilme.setTitulo(dto.getTitulo());
        listaFilme.setPosterPath(dto.getPosterPath());
        listaFilme.setAnoLancamento(dto.getAnoLancamento());
        listaFilme.setNota(dto.getNota());
        listaFilme.setGeneros(dto.getGeneros());
        
        listaFilmeRepository.save(listaFilme);
        
        System.out.println("✅ [ListaService] Filme adicionado com sucesso à lista");
    }
    
    @Transactional
    public void removerFilmeDaLista(Long usuarioId, Long listaId, Long tmdbId) {
        System.out.println("🗑️ [ListaService] Removendo filme TMDB ID: " + tmdbId + " da lista ID: " + listaId);
        
        // Verificar se a lista pertence ao usuário
        listaRepository.findByIdAndUsuarioId(listaId, usuarioId)
                .orElseThrow(() -> {
                    System.out.println("❌ [ListaService] Lista não encontrada ou não pertence ao usuário");
                    return new RuntimeException("Lista não encontrada");
                });
        
        listaFilmeRepository.deleteByListaIdAndTmdbId(listaId, tmdbId);
        
        System.out.println("✅ [ListaService] Filme removido com sucesso da lista");
    }
    
    @Transactional
    public void deletarLista(Long usuarioId, Long listaId) {
        System.out.println("🗑️ [ListaService] Deletando lista ID: " + listaId);
        
        Lista lista = listaRepository.findByIdAndUsuarioId(listaId, usuarioId)
                .orElseThrow(() -> {
                    System.out.println("❌ [ListaService] Lista não encontrada ou não pertence ao usuário");
                    return new RuntimeException("Lista não encontrada");
                });
        
        listaRepository.delete(lista);
        
        System.out.println("✅ [ListaService] Lista deletada com sucesso");
    }
    
    private ListaResponseDTO convertToDTO(Lista lista) {
        ListaResponseDTO dto = new ListaResponseDTO();
        dto.setId(lista.getId());
        dto.setNome(lista.getNome());
        dto.setDescricao(lista.getDescricao());
        dto.setUsuarioId(lista.getUsuarioId());
        dto.setDataCriacao(lista.getDataCriacao());
        dto.setDataAtualizacao(lista.getDataAtualizacao());
        
        List<FilmeListaDTO> filmes = lista.getFilmes().stream()
                .map(this::convertFilmeToDTO)
                .collect(Collectors.toList());
        
        dto.setFilmes(filmes);
        dto.setTotalFilmes(filmes.size());
        
        return dto;
    }
    
    private FilmeListaDTO convertFilmeToDTO(ListaFilme listaFilme) {
        FilmeListaDTO dto = new FilmeListaDTO();
        dto.setId(listaFilme.getId());
        dto.setTmdbId(listaFilme.getTmdbId());
        dto.setTitulo(listaFilme.getTitulo());
        dto.setPosterPath(listaFilme.getPosterPath());
        dto.setAnoLancamento(listaFilme.getAnoLancamento());
        dto.setNota(listaFilme.getNota());
        dto.setGeneros(listaFilme.getGeneros());
        dto.setDataAdicao(listaFilme.getDataAdicao());
        
        return dto;
    }
}
