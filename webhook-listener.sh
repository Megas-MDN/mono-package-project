#!/bin/bash
# Removemos 'set -e' para não matar o processo em erros não críticos
set -u  # apenas falha se variável não inicializada for usada

PORT=4080
SECRET="${SECRET_TOKEN:-}"
BRANCH="${BRANCH:-main}"
REPO_URL="${REPO_URL:-}"

echo "🚀 Auto-deployer listening on port $PORT..."
echo "🔒 Secret configurado: '$SECRET'"
echo "📦 Branch: $BRANCH"
echo "📂 Repo: $REPO_URL"
echo ""

while true; do
  echo "📡 Aguardando webhook na porta $PORT..."
  
  REQUEST=$(nc -l -p $PORT -q 1)

  HEADERS=$(echo "$REQUEST" | sed '/^\r$/q')
  BODY=$(echo "$REQUEST" | awk 'BEGIN{body=0} /^[[:space:]]*$/{body=1; next} body {print}')

  # Extrai assinatura se existir
  SIG256=$(echo "$HEADERS" | grep -i "X-Hub-Signature-256:" | awk '{print $2}' | tr -d '\r\n' || true)
  SIG1=$(echo "$HEADERS" | grep -i "X-Hub-Signature:" | awk '{print $2}' | tr -d '\r\n' || true)

  echo "-----------------------------------------"
  echo "🧾 Cabeçalhos recebidos:"
  echo "$HEADERS" | grep -E "X-|POST|Content-Type" || echo "(sem cabeçalhos X-...)"
  echo "-----------------------------------------"
  echo "📨 Corpo (início):"
  echo "$BODY" | head -n 5
  echo "-----------------------------------------"
  echo "🔐 Assinatura SHA256 recebida: ${SIG256:-<nenhuma>}"
  echo "🔐 Assinatura SHA1 recebida:   ${SIG1:-<nenhuma>}"

  # Calcula assinatura esperada se corpo e secret existirem
  LOCAL_SIG=""
  if [ -n "$BODY" ] && [ -n "$SECRET" ]; then
    LOCAL_SIG="sha256=$(echo -n "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')"
  fi

  echo "🔑 Assinatura esperada: ${LOCAL_SIG:-<indefinida>}"
  echo "-----------------------------------------"

  if [ -n "$SIG256" ] && [ "$SIG256" = "$LOCAL_SIG" ]; then
    echo "✅ Assinatura válida — iniciando redeploy..."
    cd /app || exit 1

    if [ -d .git ]; then
      echo "📥 Atualizando código..."
      git fetch origin "$BRANCH"
      git reset --hard "origin/$BRANCH"
    else
      echo "⚙️ Clonando repositório..."
      rm -rf /app/*
      git clone -b "$BRANCH" "$REPO_URL" /app
    fi

    echo "🐳 Rebuild e redeploy..."
    docker compose build --no-cache
    docker compose up -d

    echo "✅ Deploy concluído!"
  else
    echo "❌ Assinatura inválida ou ausente — ignorando webhook."
  fi

  echo ""
  echo "=========================================================="
done
