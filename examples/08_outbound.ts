/**
 * Example 8: Making Outbound HTTP Requests
 *
 * This example shows how to make HTTP requests to external URLs from within
 * a sandbox. You can use either shell commands (like curl) or run JavaScript
 * code that uses fetch.
 *
 * This is useful for testing APIs, fetching data, or any scenario where
 * your sandboxed code needs to communicate with the outside world.
 */

import { Sandbox } from "@deno/sandbox";

// Create the sandbox with labels for identification
await using sandbox = await Sandbox.create({
  labels: {
    environment: "development",
    purpose: "outbound-requests",
  },
});

console.log("Making outbound HTTP requests from the sandbox...\n");

// Method 1: Using curl to make a simple GET request
// This fetches a sample JSON response from a public test API
console.log("--- Method 1: Using curl ---");
await sandbox.sh`curl -s https://httpbin.org/get`;

console.log("\n--- Method 2: POST request with curl ---");
// Send some data to an endpoint using POST
await sandbox.sh`curl -s -X POST https://httpbin.org/post -H "Content-Type: application/json" -d '{"message": "Hello from sandbox!"}'`;

console.log("\n--- Method 3: Using JavaScript fetch ---");
// Create a JavaScript file that uses fetch, then run it with Deno
// This is useful when you need more control over the request handling

// First, write a small script to the sandbox
await sandbox.writeTextFile(
  "/home/user/fetch-example.ts",
  `
// This script runs inside the sandbox and makes a fetch request
const response = await fetch("https://httpbin.org/json");
const data = await response.json();
console.log("Fetched data:", JSON.stringify(data, null, 2));
`
);

// Run the script inside the sandbox
await sandbox.sh`deno run --allow-net /home/user/fetch-example.ts`;

console.log("\n--- Method 4: Multiple requests ---");
// You can make multiple requests to different endpoints
await sandbox.sh`curl -s https://httpbin.org/headers`;

console.log("\nAll outbound request examples complete!");
