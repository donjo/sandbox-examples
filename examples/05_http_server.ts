/**
 * Example 5: HTTP Server in a Sandbox
 *
 * You can run a web server inside the sandbox and make requests to it.
 * This is useful for testing web applications in isolation.
 */

import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

console.log("=== Creating a Simple HTTP Server ===\n");

// Create a JavaScript runtime that runs a web server
// The code string is what runs inside the sandbox
const serverCode = `
  Deno.serve({
    handler: (request) => {
      const url = new URL(request.url);

      // Simple routing based on the path
      if (url.pathname === "/") {
        return new Response("Welcome to the sandbox server!");
      }

      if (url.pathname === "/hello") {
        const name = url.searchParams.get("name") || "World";
        return new Response("Hello, " + name + "!");
      }

      if (url.pathname === "/json") {
        return new Response(
          JSON.stringify({ message: "This is JSON data", timestamp: Date.now() }),
          { headers: { "Content-Type": "application/json" } }
        );
      }

      // 404 for unknown routes
      return new Response("Not Found", { status: 404 });
    }
  });
`;

// Start the server inside the sandbox
const runtime = await sandbox.deno.run({ code: serverCode });

// Wait for the server to be ready
const isReady = await runtime.httpReady;
console.log("Server ready:", isReady);

console.log("\n=== Making Requests to the Server ===\n");

// Request the home page
const homeResponse = await runtime.fetch("http://localhost/");
console.log("GET /");
console.log("Response:", await homeResponse.text());

// Request with a query parameter
const helloResponse = await runtime.fetch("http://localhost/hello?name=Designer");
console.log("\nGET /hello?name=Designer");
console.log("Response:", await helloResponse.text());

// Request JSON data
const jsonResponse = await runtime.fetch("http://localhost/json");
console.log("\nGET /json");
const jsonData = await jsonResponse.json();
console.log("Response:", jsonData);

// Try a 404
const notFoundResponse = await runtime.fetch("http://localhost/unknown");
console.log("\nGET /unknown");
console.log("Status:", notFoundResponse.status, notFoundResponse.statusText);

console.log("\nAll done! Server will be cleaned up automatically.");
