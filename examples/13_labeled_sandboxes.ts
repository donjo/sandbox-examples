/**
 * Example 13: Seeding Labeled Sandboxes
 *
 * This script creates a series of sandboxes, each tagged with labels
 * and set to persist for 5 minutes. They are intentionally left open
 * so you can inspect or filter them using the sandbox management example (12).
 *
 * Run `deno task management` afterwards to see them listed and filtered by label.
 */

import { Sandbox } from "@deno/sandbox";

console.log("=== Creating Labeled Sandboxes ===\n");
console.log("Each sandbox will stay open for 5 minutes.\n");

// Create a frontend sandbox for the design team
const frontend = await Sandbox.create({
  timeout: "5m",
  labels: {
    team: "design",
    environment: "development",
    project: "website",
  },
});
console.log(`Created frontend sandbox:  ${frontend.id}`);

// Create a backend sandbox for the engineering team
const backend = await Sandbox.create({
  timeout: "5m",
  labels: {
    team: "engineering",
    environment: "development",
    project: "api",
  },
});
console.log(`Created backend sandbox:   ${backend.id}`);

// Create a staging sandbox shared between teams
const staging = await Sandbox.create({
  timeout: "5m",
  labels: {
    team: "design",
    environment: "staging",
    project: "website",
  },
});
console.log(`Created staging sandbox:   ${staging.id}`);

// Create a data pipeline sandbox
const pipeline = await Sandbox.create({
  timeout: "5m",
  labels: {
    team: "engineering",
    environment: "staging",
    project: "data-pipeline",
  },
});
console.log(`Created pipeline sandbox:  ${pipeline.id}`);

console.log("\n=== All 4 sandboxes are running ===\n");
console.log("They will automatically close after 5 minutes.");
console.log('Run `deno task management` to list and filter them by label.\n');
