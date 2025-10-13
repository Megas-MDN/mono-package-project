const crypto = require("crypto");

function verifySignature(req, secret) {
  const signature256 = req.headers["x-hub-signature-256"];
  if (!signature256) return false;

  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac("sha256", secret);
  const digest = "sha256=" + hmac.update(payload).digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature256),
      Buffer.from(digest)
    );
  } catch {
    return false;
  }
}

module.exports = { verifySignature };
