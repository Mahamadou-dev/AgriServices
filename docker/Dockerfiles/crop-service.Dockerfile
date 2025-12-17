# Étape de construction
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration Maven
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Télécharger les dépendances
RUN ./mvnw dependency:go-offline -B

# Copier le code source
COPY src ./src

# Construire l'application
RUN ./mvnw clean package -DskipTests

# Étape d'exécution
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S -G appuser appuser

# Copier le JAR depuis l'étape de construction
COPY --from=builder /app/target/*.jar app.jar

# Changer les permissions
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]