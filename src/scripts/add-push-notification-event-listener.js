import fs from "fs";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import { minify } from "minify";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

const serviceWorkerFile = fs.readFileSync(
  resolve(currentDirectory, "../../dist/sw.js"),
  "utf-8"
);

fs.writeFileSync(
  resolve(currentDirectory, "../../dist/sw.js"),
  serviceWorkerFile.replace("}));", "")
);

const pushNotificationEventListenerFileMinified = await minify(
  resolve(currentDirectory, "push-notification-event-listener.js")
);

pushNotificationEventListenerFileMinified.slice(0, -1);

fs.appendFileSync(
  resolve(currentDirectory, "../../dist/sw.js"),
  "," + pushNotificationEventListenerFileMinified + "}));"
);
