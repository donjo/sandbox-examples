/**
 * Example 11: Extending Sandbox Lifetime
 *
 * By default, sandboxes have a limited lifetime (they automatically close
 * after a certain amount of time). This is a safety feature to prevent
 * runaway sandboxes from consuming resources forever.
 *
 * But what if your task takes longer than expected? The NEW extendTimeout()
 * method (v0.5.0) lets you request more time while your sandbox is running!
 *
 * Use cases:
 * - Long-running builds or compilations
 * - AI code generation that takes variable time
 * - Interactive sessions that need to stay open
 * - Processing large datasets
 *
 * Important notes:
 * - You can extend by up to 30 minutes at a time
 * - The actual extension might be slightly different than requested
 * - Always check the returned Date to know the exact new expiry time
 */

import { Sandbox } from "@deno/sandbox";

console.log("=== Sandbox Lifetime Management Demo ===\n");

// Create a sandbox with a short initial lifetime
// We'll use "5m" (5 minutes) for this demo
const sandbox = await Sandbox.create({
  timeout: "5m", // Sandbox will expire in 5 minutes
  labels: {
    purpose: "lifetime-demo",
  },
});

console.log("Sandbox created with 5 minute lifetime.\n");

// Simulate doing some work
console.log("Simulating a long-running task...\n");

// Step 1: Do some initial work
console.log("Step 1: Setting up project files...");
await sandbox.fs.mkdir("/home/user/project");
await sandbox.fs.writeTextFile("/home/user/project/data.txt", "Initial data");
await sandbox.sh`echo "Files created"`;

// Step 2: Realize we need more time
console.log("\nStep 2: Task is taking longer than expected...");
console.log("         Let's extend the sandbox lifetime!\n");

// Extend the lifetime by 5 more minutes
// The format is either "Xs" for seconds or "Xm" for minutes
const newExpiry = await sandbox.extendTimeout("5m");

console.log("Lifetime extended!");
console.log(`New expiry time: ${newExpiry.toISOString()}`);
console.log(`That's: ${newExpiry.toLocaleTimeString()}\n`);

// Step 3: Continue working with the extended time
console.log("Step 3: Continuing work with extended lifetime...");
await sandbox.fs.writeTextFile("/home/user/project/more_data.txt", "Additional data after extension");
await sandbox.sh`echo "More work completed"`;

// Step 4: Extend again if needed (you can call it multiple times)
console.log("\nStep 4: Extending lifetime again...\n");

// This time, let's extend by 10 minutes (600 seconds)
const evenNewerExpiry = await sandbox.extendTimeout("600s");

console.log("Extended again!");
console.log(`New expiry time: ${evenNewerExpiry.toISOString()}`);
console.log(`That's: ${evenNewerExpiry.toLocaleTimeString()}\n`);

// Calculate how much time we have left
const now = new Date();
const timeLeftMs = evenNewerExpiry.getTime() - now.getTime();
const timeLeftMinutes = Math.round(timeLeftMs / 1000 / 60);

console.log(`Time remaining: approximately ${timeLeftMinutes} minutes\n`);

// Step 5: Finish up
console.log("Step 5: Completing the task...");
await sandbox.fs.writeTextFile("/home/user/project/final_output.txt", "Task completed successfully!");

// List what we created
console.log("\nFiles created during our extended session:");
for await (const entry of sandbox.fs.readDir("/home/user/project")) {
  console.log(`  - ${entry.name}`);
}

// Clean up manually (since we didn't use "await using")
await sandbox[Symbol.asyncDispose]();

console.log("\n=== Lifetime Demo Complete! ===");
console.log("\nKey takeaways:");
console.log("  - Use extendTimeout('5m') to add 5 minutes");
console.log("  - Use extendTimeout('300s') to add 300 seconds");
console.log("  - Maximum extension is 30 minutes at a time");
console.log("  - You can call it multiple times as needed");
console.log("  - Always check the returned Date for the actual new expiry");
