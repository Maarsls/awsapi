const app = require("./app");
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// Dependencies
const fs = require("fs");
const http = require("http");
const https = require("https");

// Certificate
const privateKey = fs.readFileSync(
  process.cwd() + "/etc/letsencrypt/live/tyvent.at/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  process.cwd() + "/etc/letsencrypt/live/tyvent.at/cert.pem",
  "utf8"
);
const ca = fs.readFileSync(
  process.cwd() + "/etc/letsencrypt/live/tyvent.at/chain.pem",
  "utf8"
);

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(5001, () => {
  console.log("HTTP Server running on port 5001");
});

httpsServer.listen(5000, () => {
  console.log("HTTPS Server running on port 5000");
});
