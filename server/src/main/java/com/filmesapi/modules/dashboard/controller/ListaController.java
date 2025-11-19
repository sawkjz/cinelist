package com.filmesapi.modules.dashboard.controller;

import com.filmesapi.modules.dashboard.dto.AdicionarFilmeDTO;
import com.filmesapi.modules.dashboard.dto.CriarListaDTO;
import com.filmesapi.modules.dashboard.dto.ListaResponseDTO;
import com.filmesapi.modules.dashboard.service.ListaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/listas")
@RequiredArgsConstructor
public class ListaController {
    
    private final ListaService listaService;
    
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ListaResponseDTO>> buscarListasDoUsuario(@PathVariable Long usuarioId) {
        System.out.println("🌐 [ListaController] GET /api/listas/usuario/" + usuarioId);
        
        try {
            List<ListaResponseDTO> listas = listaService.buscarListasDoUsuario(usuarioId);
            
            System.out.println("✅ [ListaController] Retornando " + listas.size() + " listas");
            return ResponseEntity.ok(listas);
            
        } catch (Exception e) {
            System.out.println("❌ [ListaController] Erro ao buscar listas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<ListaResponseDTO> criarLista(
            @PathVariable Long usuarioId,
            @RequestBody CriarListaDTO dto) {
        
        System.out.println("🌐 [ListaController] POST /api/listas/usuario/" + usuarioId);
        System.out.println("📦 [ListaController] Dados recebidos: " + dto);
        
        try {
            ListaResponseDTO lista = listaService.criarLista(usuarioId, dto);
            
            System.out.println("✅ [ListaController] Lista criada com sucesso - ID: " + lista.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(lista);
            
        } catch (RuntimeException e) {
            System.out.println("❌ [ListaController] Erro ao criar lista: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            
        } catch (Exception e) {
            System.out.println("❌ [ListaController] Erro interno: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/usuario/{usuarioId}/adicionar-filme")
    public ResponseEntity<Map<String, String>> adicionarFilme(
            @PathVariable Long usuarioId,
            @RequestBody AdicionarFilmeDTO dto) {
        
        System.out.println("🌐 [ListaController] POST /api/listas/usuario/" + usuarioId + "/adicionar-filme");
        System.out.println("📦 [ListaController] Dados recebidos: " + dto);
        
        try {
            listaService.adicionarFilmeNaLista(usuarioId, dto);
            
            System.out.println("✅ [ListaController] Filme adicionado com sucesso");
            return ResponseEntity.ok(Map.of("message", "Filme adicionado com sucesso"));
            
        } catch (RuntimeException e) {
            System.out.println("❌ [ListaController] Erro ao adicionar filme: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
                    
        } catch (Exception e) {
            System.out.println("❌ [ListaController] Erro interno: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao adicionar filme"));
        }
    }
    
    @DeleteMapping("/usuario/{usuarioId}/lista/{listaId}/filme/{tmdbId}")
    public ResponseEntity<Map<String, String>> removerFilme(
            @PathVariable Long usuarioId,
            @PathVariable Long listaId,
            @PathVariable Long tmdbId) {
        
        System.out.println("🌐 [ListaController] DELETE /api/listas/usuario/" + usuarioId + "/lista/" + listaId + "/filme/" + tmdbId);
        
        try {
            listaService.removerFilmeDaLista(usuarioId, listaId, tmdbId);
            
            System.out.println("✅ [ListaController] Filme removido com sucesso");
            return ResponseEntity.ok(Map.of("message", "Filme removido com sucesso"));
            
        } catch (RuntimeException e) {
            System.out.println("❌ [ListaController] Erro ao remover filme: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
                    
        } catch (Exception e) {
            System.out.println("❌ [ListaController] Erro interno: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao remover filme"));
        }
    }
    
    @DeleteMapping("/usuario/{usuarioId}/lista/{listaId}")
    public ResponseEntity<Map<String, String>> deletarLista(
            @PathVariable Long usuarioId,
            @PathVariable Long listaId) {
        
        System.out.println("🌐 [ListaController] DELETE /api/listas/usuario/" + usuarioId + "/lista/" + listaId);
        
        try {
            listaService.deletarLista(usuarioId, listaId);
            
            System.out.println("✅ [ListaController] Lista deletada com sucesso");
            return ResponseEntity.ok(Map.of("message", "Lista deletada com sucesso"));
            
        } catch (RuntimeException e) {
            System.out.println("❌ [ListaController] Erro ao deletar lista: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
                    
        } catch (Exception e) {
            System.out.println("❌ [ListaController] Erro interno: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao deletar lista"));
        }
    }
}
