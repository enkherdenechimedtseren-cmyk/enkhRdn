const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- VAPID keys (generate using: npx web-push generate-vapid-keys)
const vapidKeys = {
  publicKey: "YOUR_PUBLIC_KEY_HERE",
  privateKey: "YOUR_PRIVATE_KEY_HERE"
};

webpush.setVapidDetails(
  "mailto:test@example.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let subs = [];

// save subscription
app.post("/subscribe", (req, res) => {
  subs.push(req.body);
  console.log("New subscription:", req.body);
  res.sendStatus(201);
});

// send notification
app.get("/send", (req, res) => {
  const payload = JSON.stringify({
    title: "New Notification!",
    body: "This is a test notification",
    url: "https://google.com"
  });

  subs.forEach(sub => {
    webpush.sendNotification(sub, payload).catch(err => console.log(err));
  });

  res.send("Notification Sent");
});

app.listen(3000, () => console.log("Server running on port 3000"));
