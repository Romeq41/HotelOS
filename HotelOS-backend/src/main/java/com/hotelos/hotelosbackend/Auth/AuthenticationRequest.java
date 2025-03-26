package com.hotelos.hotelosbackend.Auth;


import com.hotelos.hotelosbackend.models.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest{
    private String token;
}
