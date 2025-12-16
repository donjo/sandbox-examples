/**
 * Example 1: Running Shell Commands
 *
 * This is the simplest way to use a sandbox - running terminal commands.
 * It's like having a mini terminal that's completely isolated from your system.
 *
 * This example also demonstrates using labels to tag your sandbox.
 * Labels help identify and filter sandboxes (up to 5 labels allowed).
 */

import { Sandbox } from "@deno/sandbox";

// Create the sandbox with labels for identification
// Labels are key-value pairs that help you organize and filter sandboxes
await using sandbox = await Sandbox.create({
  labels: {
    environment: "development",
    purpose: "shell-example",
    version: "1.0",
  },
});

console.log("Running some shell commands in the sandbox...\n");
console.log("This sandbox is labeled with: environment=development, purpose=shell-example\n");

// Basic echo command
await sandbox.sh`echo "Hello from the sandbox!"`;

// You can run multiple commands
await sandbox.sh`echo "Current directory contents:"`;
await sandbox.sh`ls -la`;

// Commands with variables work too
const name = "Designer";
await sandbox.sh`echo "Welcome, ${name}!"`;

// You can also chain commands with &&
await sandbox.sh`echo "Step 1" && echo "Step 2" && echo "Step 3"`;

console.log("\nAll done!");
