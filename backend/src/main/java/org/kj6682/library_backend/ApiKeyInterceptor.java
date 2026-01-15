package org.kj6682.library_backend;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.lang.NonNull;

@Component
public class ApiKeyInterceptor implements HandlerInterceptor {

    @Value("${app.api-key}")
    private String apiKey;

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull Object handler)
            throws Exception {
        // Allow Swagger UI and API docs to bypass auth if they happen to match the
        // pattern (though config should handle path matching)
        if (request.getRequestURI().startsWith("/swagger-ui") || request.getRequestURI().startsWith("/v3/api-docs")) {
            return true;
        }

        String requestApiKey = request.getHeader("X-API-KEY");
        if (apiKey.equals(requestApiKey)) {
            return true;
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return false;
    }
}
