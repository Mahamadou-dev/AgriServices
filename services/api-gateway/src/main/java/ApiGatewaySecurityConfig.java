// Exemple de configuration dans services/api-gateway/src/main/java/.../ApiGatewaySecurityConfig.java

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class ApiGatewaySecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        // Configuration initiale: Désactiver CSRF et autoriser tout le trafic
        // (La vraie logique de vérification JWT sera ajoutée plus tard)
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchanges -> exchanges
                        .anyExchange().permitAll() // Permet toutes les requêtes de passer à travers
                );
        return http.build();
    }
}