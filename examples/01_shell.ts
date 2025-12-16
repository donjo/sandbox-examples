/**
 * Example 1: Running Shell Commands
 *
 * This is the simplest way to use a sandbox - running terminal commands.
 * It's like having a mini terminal that's completely isolated from your system.
 */

import { Sandbox } from "@deno/sandbox";

// Create the sandbox (automatically cleaned up when done)
await using sandbox = await Sandbox.create();

console.log("Running some shell commands in the sandbox...\n");

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
