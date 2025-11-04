package modules.titulos.service;

import modules.titulos.model.Titulo;
import modules.titulos.repository.TituloRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TituloService {
    private final TituloRepository repo;

    public TituloService(TituloRepository repo) { this.repo = repo; }

    public List<Titulo> listar() { return repo.findAll(); }
    
    public Titulo obter(Long id) { 
        return repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Título não encontrado")); 
    }
    
    public Titulo criar(Titulo t) { return repo.save(t); }
    
    public Titulo atualizar(Long id, Titulo t) {
        Titulo atual = obter(id);
        atual.setNome(t.getNome());
        atual.setPlataforma(t.getPlataforma());
        atual.setStatus(t.getStatus());
        atual.setAvaliacao(t.getAvaliacao());
        return repo.save(atual);
    }
    
    public void excluir(Long id) { repo.deleteById(id); }
}
