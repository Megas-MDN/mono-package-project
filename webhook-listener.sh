#!/bin/bash
set -e

PORT=4080
SECRET="$SECRET_TOKEN"

echo "🚀 Auto-deployer listening on port $PORT..."
echo "🔒 Secret token: $SECRET"
echo "📦 Branch: ${BRANCH:-main}"
echo "📂 Repo: ${REPO_URL}"

while true; do
  REQUEST=$(nc -l -p $PORT -q 1)
  if echo "$REQUEST" | grep -q "$SECRET"; then
    echo ""
    echo "✅ Webhook recebido — iniciando redeploy..."
    cd /app

    if [ -d .git ]; then
      echo "📥 Pulling latest changes..."
      git fetch origin "${BRANCH:-main}"
      git reset --hard "origin/${BRANCH:-main}"
    else
      echo "⚙️ Clonando repositório..."
      rm -rf /app/*
      git clone -b "${BRANCH:-main}" "$REPO_URL" /app
    fi

    echo "🐳 Rebuilding and redeploying containers..."
    docker compose build --no-cache
    docker compose up -d

    echo "✅ Deploy concluído com sucesso!"
  else
    echo "❌ Webhook ignorado — token incorreto."
  fi
done
