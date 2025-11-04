package com.example.api.controller;

import com.example.api.model.Titulo;
import com.example.api.service.TituloService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/titulos")
public class TituloController {
    private final TituloService service;

    public TituloController(TituloService service) {
        this.service = service;
    }

    @GetMapping
    public List<Titulo> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Titulo> obter(@PathVariable Long id) {
        try {
            Titulo titulo = service.obter(id);
            return ResponseEntity.ok(titulo);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Titulo> criar(@RequestBody Titulo titulo) {
        try {
            Titulo novoTitulo = service.criar(titulo);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoTitulo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Titulo> atualizar(@PathVariable Long id, @RequestBody Titulo titulo) {
        try {
            Titulo tituloAtualizado = service.atualizar(id, titulo);
            return ResponseEntity.ok(tituloAtualizado);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        try {
            service.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
