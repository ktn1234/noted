import fs from "fs";
import process from "node:process";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import webpush from "web-push";

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
  title: "Push Notification Title",
  body: "Body Content",
  url: "http://localhost:5173",
  timestamp: Date.now()
};

const endpoints = [];

try {
  await Promise.all(
    endpoints.map(async (endpoint) => {
      const details = webpush.generateRequestDetails(
        endpoint,
        JSON.stringify(data)
      );

      console.log("Web Push details:", JSON.stringify(details, null, 2));

      const sendResult = await webpush.sendNotification(
        endpoint,
        JSON.stringify(data)
      );

      console.log(`Push Notification Sent to endpoint ${endpoint.endpoint}`);
      console.log(
        "Push notification send result:",
        JSON.stringify(sendResult, null, 2),
        "\n\n"
      );
    })
  );
} catch (err) {
  console.error("[ERROR] Push Notification Error: ", err);
}
