package com.filmesapi.modules.auth.controller;

import com.filmesapi.modules.auth.dto.UsuarioSyncRequest;
import com.filmesapi.modules.auth.dto.UsuarioSyncResponse;
import com.filmesapi.modules.auth.service.UsuarioSyncService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "${app.cors.allowed-origin}")
public class UsuarioController {

    private final UsuarioSyncService usuarioSyncService;

    public UsuarioController(UsuarioSyncService usuarioSyncService) {
        this.usuarioSyncService = usuarioSyncService;
    }

    @PostMapping("/sync")
    public ResponseEntity<UsuarioSyncResponse> syncUsuario(@RequestBody UsuarioSyncRequest request) {
        UsuarioSyncResponse response = usuarioSyncService.syncUsuario(request);
        return ResponseEntity.ok(response);
    }
}
