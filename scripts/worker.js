#!/usr/bin/env node
// scripts/worker.js

console.log("Worker starting up…");
// Insert your real polling/sync logic below. Example:
async function pollTasks() {
  // TODO: fetch tasks from your DB or API
  console.log("Polling for tasks…");
}
(async () => {
  while (true) {
    try {
      await pollTasks();
    } catch (err) {
      console.error("Worker error:", err);
    }
    // wait 5 seconds between polls
    await new Promise(r => setTimeout(r, 5000));
  }
})();
