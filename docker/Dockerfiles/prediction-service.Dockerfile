FROM python:3.12-slim

WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 python && \
    adduser --system --uid 1001 --gid 1001 python

# Copier les fichiers de dépendances
COPY services/prediction-service/requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copier le code source
COPY services/prediction-service/ ./

# Changer les permissions
RUN chown -R python:python /app
USER python

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]