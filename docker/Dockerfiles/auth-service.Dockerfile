#
# Stage 1: Étape de construction (Utilise JDK 21)
#
FROM openjdk:21-jdk-slim AS builder # CHANGEMENT ICI : 25 -> 21

WORKDIR /app

# Copier les fichiers de configuration Maven
COPY services/auth-service/pom.xml .
COPY services/auth-service/mvnw .
COPY services/auth-service/.mvn .mvn

# Télécharger les dépendances
RUN ./mvnw dependency:go-offline -B

# Copier le code source
COPY services/auth-service/src ./src

# Construire l'application
RUN ./mvnw clean package -DskipTests

#
# Stage 2: Étape d'exécution (Utilise JRE 21)
#
FROM openjdk:21-jre-slim # CHANGEMENT ICI : 25 -> 21

WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 spring && \
    adduser --system --uid 1001 --gid 1001 spring

# Copier le JAR depuis l'étape de construction
COPY --from=builder /app/target/*.jar app.jar

# Changer les permissions
RUN chown -R spring:spring /app
USER spring

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]