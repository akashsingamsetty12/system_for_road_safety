package com.example.backend.config;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RequestResponseLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        long startTime = System.currentTimeMillis();
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();
        String contentType = request.getContentType();
        long contentLength = request.getContentLengthLong();
        
        logger.info("📨 [REQUEST] " + method + " " + uri + 
                   (queryString != null ? "?" + queryString : "") +
                   " | Content-Type: " + contentType + 
                   " | Size: " + (contentLength > 0 ? formatBytes(contentLength) : "unknown"));
        
        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            int status = response.getStatus();
            String statusLabel = status >= 200 && status < 300 ? "✅" : 
                                 status >= 400 && status < 500 ? "⚠️" : 
                                 status >= 500 ? "❌" : "ℹ️";
            
            logger.info(statusLabel + " [RESPONSE] " + method + " " + uri + 
                       " | Status: " + status + 
                       " | Duration: " + duration + "ms");
        }
    }
    
    private String formatBytes(long bytes) {
        if (bytes <= 0) return "0B";
        final String[] units = new String[] { "B", "KB", "MB", "GB" };
        int digitGroups = (int) (Math.log10(bytes) / Math.log10(1024));
        return String.format("%.2f %s", bytes / Math.pow(1024, digitGroups), units[digitGroups]);
    }
}
