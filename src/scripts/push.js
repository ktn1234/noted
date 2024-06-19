import webpush from "web-push";
import fs from "fs";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import process from "node:process";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

const localEnvPath = resolve(currentDirectory, ".env.local");
if (!fs.existsSync(localEnvPath)) {
  console.error(`[ERROR] .env.local file is not found at ${localEnvPath}`);
  process.exit(1);
}

// Load environment variables
const { VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = JSON.parse(
  fs.readFileSync(localEnvPath, "utf-8")
);

if (!VAPID_SUBJECT || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error("[ERROR] VAPID keys are not provided");
  process.exit(1);
}

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const data = {
  body: "Push Notification",
  url: "http://localhost:5173",
};

const endpoint = {};

try {
  await webpush.sendNotification(endpoint, JSON.stringify(data));
  console.log("Push Notification Sent");
} catch (err) {
  console.error("[ERROR] Push Notification Error: ", err);
}
