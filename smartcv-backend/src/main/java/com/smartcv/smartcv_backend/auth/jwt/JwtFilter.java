package com.smartcv.smartcv_backend.auth.jwt;

import com.smartcv.smartcv_backend.auth.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        String method = request.getMethod();

        // ✅ Allow OPTIONS (CORS) + public auth endpoints
        boolean skip = method.equalsIgnoreCase("OPTIONS") ||
                path.startsWith("/api/auth");

        if (skip) {
            log.debug("🔓 Skipping JWT filter for: {} {}", method, path);
        } else {
            log.debug("🔒 Applying JWT filter for: {} {}", method, path);
        }

        return skip;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("❌ Missing or invalid Authorization header for {}", request.getServletPath());
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
        String email;

        try {
            email = jwtUtil.extractEmail(token);
            log.debug("📧 Extracted email from token: {}", email);
        } catch (Exception e) {
            log.warn("⚠️ Token parsing failed for {}: {}", request.getServletPath(), e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails;
            try {
                userDetails = customUserDetailsService.loadUserByUsername(email);
            } catch (Exception e) {
                log.warn("🚫 User not found for email in token: {}", email);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            if (jwtUtil.validateToken(token, userDetails.getUsername())) {
                log.debug("✅ Token valid for user: {}", email);

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());

                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            } else {
                log.warn("🚫 Token validation failed for {}", email);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
