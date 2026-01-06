/**
 * Example 12: Sandbox Management with the Client API
 *
 * Sometimes you need to see what sandboxes are running in your organization,
 * especially when:
 * - Debugging why resources are being used
 * - Finding sandboxes that should have been closed
 * - Monitoring your sandbox usage
 * - Finding specific sandboxes by their labels
 *
 * NEW in v0.5.0: The client.sandboxes API lets you list and filter sandboxes!
 *
 * This example shows how to:
 * 1. List all running sandboxes
 * 2. Filter sandboxes by labels
 * 3. See sandbox metadata (ID, region, status, creation time)
 */

import { Client, Sandbox } from "@deno/sandbox";

// The Client is used for organization-level operations
// (managing sandboxes, volumes, apps, etc.)
const client = new Client({
  token: Deno.env.get("DENO_DEPLOY_TOKEN")!,
});

console.log("=== Sandbox Management Demo ===\n");

// First, let's see what sandboxes are currently running
console.log("Step 1: Listing all running sandboxes...\n");

const existingSandboxes = await client.sandboxes.list();

if (existingSandboxes.length === 0) {
  console.log("  No sandboxes currently running.\n");
} else {
  console.log(`  Found ${existingSandboxes.length} running sandbox(es):\n`);
  for (const sb of existingSandboxes) {
    console.log(`  ID: ${sb.id}`);
    console.log(`    Region: ${sb.region}`);
    console.log(`    Status: ${sb.status}`);
    console.log(`    Created: ${sb.createdAt.toLocaleString()}`);
    console.log();
  }
}

// Step 2: Create some sandboxes with labels for organization
console.log("Step 2: Creating sandboxes with labels...\n");

// Create a "development" sandbox
const devSandbox = await Sandbox.create({
  labels: {
    environment: "development",
    team: "design",
    purpose: "testing",
  },
});
console.log("  Created development sandbox");

// Create a "staging" sandbox
const stagingSandbox = await Sandbox.create({
  labels: {
    environment: "staging",
    team: "design",
    purpose: "preview",
  },
});
console.log("  Created staging sandbox");

// Create a "production" sandbox (different team)
const prodSandbox = await Sandbox.create({
  labels: {
    environment: "production",
    team: "engineering",
    purpose: "demo",
  },
});
console.log("  Created production sandbox\n");

// Step 3: List all sandboxes now
console.log("Step 3: Listing all sandboxes again...\n");

const allSandboxes = await client.sandboxes.list();
console.log(`  Total sandboxes running: ${allSandboxes.length}\n`);

for (const sb of allSandboxes) {
  console.log(`  - ${sb.id.substring(0, 8)}... (${sb.region}, ${sb.status})`);
}

// Step 4: Filter sandboxes by labels
console.log("\n Step 4: Filtering sandboxes by labels...\n");

// Find only sandboxes belonging to the "design" team
console.log('  Filtering for team="design":');
const designSandboxes = await client.sandboxes.list({
  labels: { team: "design" },
});
console.log(`  Found ${designSandboxes.length} sandbox(es) for design team\n`);

// Find only "development" environment sandboxes
console.log('  Filtering for environment="development":');
const devSandboxes = await client.sandboxes.list({
  labels: { environment: "development" },
});
console.log(`  Found ${devSandboxes.length} sandbox(es) in development\n`);

// Find sandboxes with multiple label criteria
console.log('  Filtering for team="design" AND environment="staging":');
const designStagingSandboxes = await client.sandboxes.list({
  labels: {
    team: "design",
    environment: "staging",
  },
});
console.log(`  Found ${designStagingSandboxes.length} sandbox(es) matching both criteria\n`);

// Step 5: Clean up - close all the sandboxes we created
console.log("Step 5: Cleaning up sandboxes...\n");

await devSandbox[Symbol.asyncDispose]();
console.log("  Closed development sandbox");

await stagingSandbox[Symbol.asyncDispose]();
console.log("  Closed staging sandbox");

await prodSandbox[Symbol.asyncDispose]();
console.log("  Closed production sandbox");

// Verify they're gone
console.log("\nStep 6: Verifying cleanup...\n");

const remainingSandboxes = await client.sandboxes.list();
const originalCount = existingSandboxes.length;
console.log(`  Sandboxes remaining: ${remainingSandboxes.length} (started with ${originalCount})`);

console.log("\n=== Sandbox Management Demo Complete! ===");
console.log("\nKey takeaways:");
console.log("  - Use client.sandboxes.list() to see all running sandboxes");
console.log("  - Add labels when creating sandboxes for easy filtering");
console.log("  - Filter by labels to find specific sandboxes");
console.log("  - Labels are great for organizing by team, environment, purpose, etc.");
