package com.example.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "titulos")
public class Titulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String plataforma;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusTitulo status;

    private Integer avaliacao;

    // Construtores
    public Titulo() {}

    public Titulo(String nome, String plataforma, StatusTitulo status) {
        this.nome = nome;
        this.plataforma = plataforma;
        this.status = status;
    }

    // Getters e Setters
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getNome() { 
        return nome; 
    }
    
    public void setNome(String nome) { 
        this.nome = nome; 
    }

    public String getPlataforma() { 
        return plataforma; 
    }
    
    public void setPlataforma(String plataforma) { 
        this.plataforma = plataforma; 
    }

    public StatusTitulo getStatus() { 
        return status; 
    }
    
    public void setStatus(StatusTitulo status) { 
        this.status = status; 
    }

    public Integer getAvaliacao() { 
        return avaliacao; 
    }
    
    public void setAvaliacao(Integer avaliacao) { 
        this.avaliacao = avaliacao; 
    }
}
