package modules.auth.service;

import modules.auth.dto.LoginRequest;
import modules.auth.dto.LoginResponse;
import modules.auth.dto.UserDto;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    public LoginResponse login(LoginRequest request) {
        String token = "fake-token-" + System.currentTimeMillis();
        UserDto user = new UserDto("1", request.getEmail(), "Usuário");
        
        return new LoginResponse(token, user);
    }
}
