package com.smartquiz.smartquizapi.config; // Sesuaikan package kamu

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class GlobalCorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Izinkan ngirim kredensial (cookie/header auth)
        config.setAllowCredentials(true);
        
        // Izinkan spesifik port React kamu
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        
        // Izinkan semua header (termasuk Content-Type yang bikin masalah preflight)
        config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization"));
        
        // Izinkan semua method, terutama OPTIONS (Preflight)
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Terapkan ke semua endpoint
        
        return new CorsFilter(source);
    }
}