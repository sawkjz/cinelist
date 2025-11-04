package com.example.api.service;

import com.example.api.model.Titulo;
import com.example.api.repository.TituloRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TituloService {
    private final TituloRepository repository;

    public TituloService(TituloRepository repository) {
        this.repository = repository;
    }

    public List<Titulo> listar() {
        return repository.findAll();
    }

    public Titulo obter(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Título não encontrado com ID: " + id));
    }

    public Titulo criar(Titulo titulo) {
        return repository.save(titulo);
    }

    public Titulo atualizar(Long id, Titulo titulo) {
        // Verifica se o título existe
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Título não encontrado com ID: " + id);
        }
        
        titulo.setId(id);
        return repository.save(titulo);
    }

    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Título não encontrado com ID: " + id);
        }
        repository.deleteById(id);
    }
}
