# Étape de construction
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copier les fichiers projet et restaurer les dépendances
COPY services/billing-service/*.csproj ./
RUN dotnet restore

# Copier le code source
COPY services/billing-service/ ./

# Publier l'application
RUN dotnet publish -c Release -o /app/publish

# Étape d'exécution
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 appuser && \
    adduser --system --uid 1001 --gid 1001 --shell /bin/sh appuser

EXPOSE 8085

# Copier depuis l'étape de construction
COPY --from=build /app/publish .

# Changer les permissions
RUN chown -R appuser:appuser /app
USER appuser

ENTRYPOINT ["dotnet", "billing-service.dll"]