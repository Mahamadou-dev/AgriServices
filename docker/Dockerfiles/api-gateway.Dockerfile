# Étape de construction
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copier tout le code source
COPY . .

# Construire l'application avec Maven
RUN mvn clean package -DskipTests

# Étape d'exécution
FROM eclipse-temurin:17-jre

WORKDIR /app

# Créer un utilisateur non-root
RUN groupadd -r -g 1001 spring && \
    useradd -r -u 1001 -g spring spring

# Copier le JAR depuis l'étape de construction
COPY --from=builder /app/target/*.jar app.jar

# Changer les permissions
RUN chown -R spring:spring /app
USER spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]