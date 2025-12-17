# Étape de construction
FROM openjdk:17-jdk-slim AS builder

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
FROM openjdk:17-jre-slim

WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 spring && \
    adduser --system --uid 1001 --gid 1001 spring

# Copier le JAR depuis l'étape de construction
COPY --from=builder /app/target/*.jar app.jar

# Changer les permissions
RUN chown -R spring:spring /app
USER spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]