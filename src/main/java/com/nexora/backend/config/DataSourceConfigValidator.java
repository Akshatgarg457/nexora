package com.nexora.backend.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;

/**
 * Registered via META-INF/spring.factories so it runs before any bean is created.
 *
 * An unexported credential does not fail loudly on its own. Spring leaves the
 * unresolved literal "${DB_PASSWORD}" in place, HikariCP sends that string to
 * MySQL as the password, and startup dies hundreds of lines later in Hibernate
 * with "Access denied for user ... (using password: YES)" - which reads like a
 * wrong password rather than a missing one. The same happens for DB_URL, where
 * the unresolved literal surfaces as "Unable to determine Dialect".
 */
public class DataSourceConfigValidator implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        requireNonBlank(environment, "DB_URL", "spring.datasource.url");
        requireNonBlank(environment, "DB_USERNAME", "spring.datasource.username");
        requireConfigured(environment, "DB_PASSWORD", "spring.datasource.password");
    }

    /** For values that carry a default, so only an explicitly blank override is a mistake. */
    private void requireNonBlank(ConfigurableEnvironment environment, String variable, String property) {
        String value = resolve(environment, property);
        if (value == null || value.isBlank() || value.contains("${")) {
            throw unconfigured(variable, property, value);
        }
    }

    /** For credentials with no default. Blank is allowed, absent is not. */
    private void requireConfigured(ConfigurableEnvironment environment, String variable, String property) {
        String value = resolve(environment, property);
        if (value == null || value.contains("${")) {
            throw unconfigured(variable, property, value);
        }
    }

    private String resolve(ConfigurableEnvironment environment, String property) {
        try {
            return environment.getProperty(property);
        } catch (IllegalArgumentException unresolvablePlaceholder) {
            return null;
        }
    }

    private IllegalStateException unconfigured(String variable, String property, String value) {
        return new IllegalStateException("""

                ***************************************************************
                Nexora could not start: the MySQL datasource is not configured.

                  %s is not set, so %s resolved to %s

                Spring Boot does NOT read .env on its own. Export the variable
                into the shell that launches the application, then start again:

                  Git Bash     set -a; source .env; set +a
                  PowerShell   see .env.example for the loading snippet

                To run without MySQL at all, use in-memory H2 instead. Every
                write is discarded on shutdown:

                  java -jar target/nexora-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=h2
                  ./mvnw spring-boot:run -Dspring-boot.run.profiles=h2

                The target MySQL schema must already exist; the backend never
                creates or alters a database it was not pointed at.
                ***************************************************************
                """.formatted(variable, property, value == null ? "nothing" : "'" + value + "'"));
    }
}
