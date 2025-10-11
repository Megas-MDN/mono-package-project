#!/bin/bash
set -e

PORT=4080
SECRET="$SECRET_TOKEN"

echo "🚀 Auto-deployer listening on port $PORT..."
echo "🔒 Secret configurado: '$SECRET'"
echo "📦 Branch: ${BRANCH:-main}"
echo "📂 Repo: ${REPO_URL}"
echo ""

while true; do
  echo "📡 Aguardando webhook na porta $PORT..."
  
  # Escuta a requisição inteira (headers + body)
  REQUEST=$(nc -l -p $PORT -q 1)

  # Separa cabeçalhos e corpo
  HEADERS=$(echo "$REQUEST" | sed '/^\r$/q')
  BODY=$(echo "$REQUEST" | awk 'BEGIN{body=0} /^[[:space:]]*$/{body=1; next} body {print}')

  # Extrai assinatura do GitHub
  SIG256=$(echo "$HEADERS" | grep -i "X-Hub-Signature-256:" | awk '{print $2}' | tr -d '\r\n')
  SIG1=$(echo "$HEADERS" | grep -i "X-Hub-Signature:" | awk '{print $2}' | tr -d '\r\n')

  echo "-----------------------------------------"
  echo "🧾 Cabeçalhos recebidos:"
  echo "$HEADERS" | grep -E "X-|POST|Content-Type"
  echo "-----------------------------------------"
  echo "📨 Corpo (início):"
  echo "$BODY" | head -n 5
  echo "-----------------------------------------"
  echo "🔐 Assinatura SHA256 recebida: $SIG256"
  echo "🔐 Assinatura SHA1 recebida:   $SIG1"

  # Calcula HMAC SHA256 do corpo
  LOCAL_SIG="sha256=$(echo -n "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')"

  echo "🔑 Assinatura esperada: $LOCAL_SIG"
  echo "-----------------------------------------"

  # Verifica se a assinatura confere
  if [ "$SIG256" = "$LOCAL_SIG" ]; then
    echo "✅ Assinatura válida — iniciando redeploy..."
    cd /app

    if [ -d .git ]; then
      echo "📥 Atualizando código..."
      git fetch origin "${BRANCH:-main}"
      git reset --hard "origin/${BRANCH:-main}"
    else
      echo "⚙️ Clonando repositório..."
      rm -rf /app/*
      git clone -b "${BRANCH:-main}" "$REPO_URL" /app
    fi

    echo "🐳 Rebuild e redeploy em andamento..."
    docker compose build --no-cache
    docker compose up -d

    echo "✅ Deploy concluído com sucesso!"
  else
    echo "❌ Assinatura inválida — ignorando webhook."
  fi

  echo ""
  echo "=========================================================="
done
