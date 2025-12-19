# Dockerfile simplifié
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
RUN groupadd -r -g 1001 spring && useradd -r -u 1001 -g spring spring
RUN chown -R spring:spring /app
USER spring
ENTRYPOINT ["java", "-jar", "app.jar"]
EXPOSE 8090