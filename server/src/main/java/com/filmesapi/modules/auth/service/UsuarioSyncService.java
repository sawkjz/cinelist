package com.filmesapi.modules.auth.service;

import com.filmesapi.modules.auth.dto.UsuarioSyncRequest;
import com.filmesapi.modules.auth.dto.UsuarioSyncResponse;
import com.filmesapi.modules.auth.model.Usuario;
import com.filmesapi.modules.auth.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class UsuarioSyncService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioSyncService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public UsuarioSyncResponse syncUsuario(UsuarioSyncRequest request) {
        if (request == null || request.externalId == null || request.email == null) {
            throw new IllegalArgumentException("externalId e email são obrigatórios");
        }

        Optional<Usuario> existingByExternalId = usuarioRepository.findByExternalId(request.externalId);
        Usuario usuario = existingByExternalId
                .orElseGet(() -> usuarioRepository.findByEmail(request.email).orElse(null));

        if (usuario == null) {
            usuario = new Usuario();
            usuario.setSenha(UUID.randomUUID().toString());
        }

        usuario.setExternalId(request.externalId);
        usuario.setEmail(request.email);
        if (request.nome != null && !request.nome.isBlank()) {
            usuario.setNome(request.nome);
        } else if (usuario.getNome() == null || usuario.getNome().isBlank()) {
            usuario.setNome(request.email);
        }
        if (request.avatarUrl != null) {
            usuario.setAvatarUrl(request.avatarUrl);
        }

        Usuario saved = usuarioRepository.save(usuario);

        return new UsuarioSyncResponse(
                saved.getId(),
                saved.getEmail(),
                saved.getNome(),
                saved.getAvatarUrl()
        );
    }
}
