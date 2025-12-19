/**
 * Example 7: Persistent Sandbox
 *
 * This example shows how to create a sandbox that stays open until you
 * explicitly close it, rather than closing automatically.
 *
 * The key difference: we use a regular variable instead of "await using".
 * This gives you control over when the sandbox closes.
 *
 * Type shell commands and press Enter to run them.
 * Type "exit" to close the sandbox and end the session.
 */

import { Sandbox } from "@deno/sandbox";

// Create sandbox WITHOUT "await using" so it doesn't auto-close
// This means we're responsible for closing it ourselves
const sandbox = await Sandbox.create();

console.log("Sandbox is open and ready!");
console.log('Type shell commands to run them, or "exit" to close.\n');

// Read input from the terminal line by line
const decoder = new TextDecoder();
const buf = new Uint8Array(1024);

while (true) {
  // Show a prompt
  await Deno.stdout.write(new TextEncoder().encode("sandbox> "));

  // Read user input
  const n = await Deno.stdin.read(buf);
  if (n === null) break;

  const input = decoder.decode(buf.subarray(0, n)).trim();

  // Check if user wants to exit
  if (input === "exit") {
    break;
  }

  // Skip empty lines
  if (input === "") {
    continue;
  }

  // Run the command in the sandbox
  try {
    await sandbox.sh`${input}`;
  } catch (error) {
    console.error("Error running command:", error);
  }
}

// Manually close the sandbox when we're done
// This is what "await using" would do automatically
await sandbox[Symbol.asyncDispose]();
console.log("\nSandbox closed. Goodbye!");
