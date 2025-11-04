package com.example.api.repository;

import com.example.api.model.Titulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TituloRepository extends JpaRepository<Titulo, Long> {
    // Métodos básicos já inclusos pelo JpaRepository:
    // - save(Titulo entity)
    // - findById(Long id)
    // - findAll() 
    // - deleteById(Long id)
    // - count()
    // - existsById(Long id)
}
