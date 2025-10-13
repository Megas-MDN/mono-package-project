const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const { verifySignature } = require("./verifySignature");

const app = express();
app.use(express.json());

const PORT = 4001;
const SECRET = process.env.GITHUB_SECRET;
const REPO_PATH = process.env.REPO_PATH || "/app/mono-package-project";
const REPO_URL = process.env.REPO_URL;

app.post("/", (req, res) => {
  // Verifica assinatura do webhook
  const isValid = verifySignature(req, SECRET);
  if (!isValid) {
    console.log("❌ Invalid signature — ignoring webhook");
    return res.status(401).send("Invalid signature");
  }

  const event = req.headers["x-github-event"];
  if (event !== "push") {
    console.log(`ℹ️ Ignored event: ${event}`);
    return res.status(200).send("Ignored event");
  }

  console.log("📥 Webhook received — starting redeploy...");

  // Se o repositório ainda não existe, clona
  if (!fs.existsSync(REPO_PATH)) {
    console.log("🆕 Cloning repository for the first time...");
    exec(`git clone ${REPO_URL} ${REPO_PATH}`, (err) => {
      if (err) {
        console.error("❌ Clone failed:", err);
        return res.status(500).send("Clone failed");
      }
      redeploy(res);
    });
  } else {
    redeploy(res);
  }
});

function redeploy(res) {
  const command = `
    cd ${REPO_PATH} &&
    echo "📥 Pulling latest changes..." &&
    git fetch origin main &&
    git reset --hard origin/main &&
    echo "🔨 Rebuilding Docker stack..." &&
    docker-compose down &&
    docker-compose up -d --build
  `;

  exec(command, { cwd: REPO_PATH }, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Deployment failed:", stderr);
      return res.status(500).send("Deployment failed");
    }

    console.log("✅ Deployment successful:\n", stdout);
    res.status(200).send("Deployment successful");
  });
}

app.listen(PORT, () => {
  console.log(`⚙️ Auto-deploy service running on port ${PORT}`);
});
