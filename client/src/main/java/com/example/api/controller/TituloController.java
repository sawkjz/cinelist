package com.example.api.controller;

import com.example.api.model.Titulo;
import com.example.api.service.TituloService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/titulos")
public class TituloController {
    private final TituloService service;

    public TituloController(TituloService service) { this.service = service; }

    @GetMapping
    public List<Titulo> listar() { return service.listar(); }

    @GetMapping("/{id}")
    public Titulo obter(@PathVariable Long id) { return service.obter(id); }

    @PostMapping
    public Titulo criar(@RequestBody Titulo t) { return service.criar(t); }

    @PutMapping("/{id}")
    public Titulo atualizar(@PathVariable Long id, @RequestBody Titulo t) { return service.atualizar(id, t); }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) { service.excluir(id); }
}
