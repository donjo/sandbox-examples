/**
 * Example 6: Working with Volumes
 *
 * Volumes are persistent storage that survives beyond a single sandbox session.
 * Unlike regular sandbox files (which disappear when the sandbox closes),
 * volume data persists and can be shared across multiple sandbox instances.
 *
 * Use cases:
 * - Store data that needs to persist between runs
 * - Share files between different sandbox instances
 * - Cache dependencies or build artifacts
 *
 * NOTE: This example requires the local Deno Deploy dev environment to be running.
 * The Client API connects to DENO_DEPLOY_CONSOLE_ENDPOINT for volume management.
 */

import { Client, Sandbox } from "@deno/sandbox";

// The Client is used for managing volumes (separate from Sandbox)
const client = new Client({
  token: Deno.env.get("DENO_DEPLOY_TOKEN")!,
});

const VOLUME_SLUG = "example-volume";

console.log("=== Creating a Volume ===\n");

// First, let's clean up any existing volume from previous runs
const existingVolume = await client.volumes.get(VOLUME_SLUG);
if (existingVolume) {
  console.log("Found existing volume, deleting it first...");
  await client.volumes.delete(VOLUME_SLUG);
}

// Create a new volume
// Capacity can be specified as bytes (number) or human-readable strings
const volume = await client.volumes.create({
  slug: VOLUME_SLUG,
  region: "ord",
  capacity: "1GB", // Also accepts: "500MB", "1GiB", "100MiB", or bytes as number
});

console.log("Created volume:");
console.log("  ID:", volume.id);
console.log("  Slug:", volume.slug);
console.log("  Region:", volume.region);
console.log("  Capacity:", volume.capacity, "bytes");

console.log("\n=== Mounting Volume in a Sandbox ===\n");

// Create a sandbox with the volume mounted at /data
await using sandbox = await Sandbox.create({
  volumes: {
    "/data": volume.slug, // Mount point -> volume slug or ID
  },
});

// Write some data to the volume
await sandbox.writeTextFile("/data/message.txt", "Hello from the first sandbox!");
await sandbox.mkdir("/data/logs");
await sandbox.writeTextFile("/data/logs/app.log", "Started at " + new Date().toISOString());

console.log("Written files to volume:");
for await (const entry of sandbox.readDir("/data")) {
  console.log("  /data/" + entry.name);
}

// Read back what we wrote
const message = await sandbox.readTextFile("/data/message.txt");
console.log("\nMessage from volume:", message);

console.log("\n=== Volume Persistence Demo ===\n");

// Create a NEW sandbox with the same volume to show persistence
await using sandbox2 = await Sandbox.create({
  volumes: {
    "/data": volume.slug,
  },
});

// The data from the first sandbox should still be there
const persistedMessage = await sandbox2.readTextFile("/data/message.txt");
console.log("Data persisted across sandboxes:", persistedMessage);

// Add more data from this sandbox
await sandbox2.writeTextFile("/data/message2.txt", "Hello from the second sandbox!");

console.log("\n=== Listing Volumes ===\n");

// List all volumes in your organization
const volumeList = await client.volumes.list();
console.log("Volumes in organization:");
for (const vol of volumeList.items) {
  console.log(`  ${vol.slug} (${vol.region}) - ${vol.used}/${vol.capacity} bytes used`);
}

console.log("\n=== Cleanup ===\n");

// Delete the volume when done (optional - you might want to keep it!)
await client.volumes.delete(volume.slug);
console.log("Deleted volume:", volume.slug);

console.log("\nAll done!");
