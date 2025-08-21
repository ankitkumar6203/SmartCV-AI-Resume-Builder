package com.smartcv.smartcv_backend.auth;

import lombok.Data;

@Data
public class UserLoginRequest {
    private String email;
    private String password;
}

