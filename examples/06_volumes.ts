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
 */

import { Client, Sandbox } from "@deno/sandbox";

// The Client is used for managing volumes (separate from Sandbox)
const client = new Client({
  token: Deno.env.get("DENO_DEPLOY_TOKEN")!,
});

const VOLUME_SLUG = "example-volume";
const VOLUME_REGION = "ord";

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
  region: VOLUME_REGION,
  capacity: "1GB", // Also accepts: "500MB", "1GiB", "100MiB", or bytes as number
});

console.log("Created volume:");
console.log("  ID:", volume.id);
console.log("  Slug:", volume.slug);
console.log("  Region:", volume.region);
console.log("  Capacity:", volume.capacity, "bytes");

console.log("\n=== Mounting Volume in a Sandbox ===\n");

// Create a sandbox with the volume mounted at /data
// IMPORTANT: The sandbox must be in the same region as the volume!
await using sandbox = await Sandbox.create({
  region: VOLUME_REGION,
  volumes: {
    "/data": volume.slug, // Mount point -> volume slug or ID
  },
});

// Write some data to the volume
await sandbox.writeTextFile(
  "/data/message.txt",
  "Hello from the first sandbox!",
);
await sandbox.mkdir("/data/logs");
await sandbox.writeTextFile(
  "/data/logs/app.log",
  "Started at " + new Date().toISOString(),
);

console.log("Written files to volume:");
for await (const entry of sandbox.readDir("/data")) {
  console.log("  /data/" + entry.name);
}

// Read back what we wrote
const message = await sandbox.readTextFile("/data/message.txt");
console.log("\nMessage from volume:", message);

console.log("\n=== Writing a 1MB File ===\n");

// Create a 1MB file to test data usage tracking
// 1MB = 1,048,576 bytes (1024 * 1024)
const ONE_MB = 1024 * 1024;
const largeData = new Uint8Array(ONE_MB);

// Fill with some pattern so it's not all zeros
for (let i = 0; i < ONE_MB; i++) {
  largeData[i] = i % 256;
}

await sandbox.writeFile("/data/large-file.bin", largeData);
console.log("Created 1MB file at /data/large-file.bin");

// Verify the file size
const fileInfo = await sandbox.stat("/data/large-file.bin");
console.log("File size:", fileInfo.size, "bytes");
console.log("File size:", (fileInfo.size / 1024 / 1024).toFixed(2), "MB");

console.log("\n=== Volume Persistence Demo ===\n");

// Create a NEW sandbox with the same volume to show persistence
await using sandbox2 = await Sandbox.create({
  region: VOLUME_REGION,
  volumes: {
    "/data": volume.slug,
  },
});

// The data from the first sandbox should still be there
const persistedMessage = await sandbox2.readTextFile("/data/message.txt");
console.log("Data persisted across sandboxes:", persistedMessage);

// Add more data from this sandbox
await sandbox2.writeTextFile(
  "/data/message2.txt",
  "Hello from the second sandbox!",
);

// Verify the large file persisted too
const persistedFileInfo = await sandbox2.stat("/data/large-file.bin");
console.log(
  "Large file persisted:",
  (persistedFileInfo.size / 1024 / 1024).toFixed(2),
  "MB",
);

console.log("\n=== Checking Volume Usage ===\n");

// List all volumes in your organization to see usage
const volumeList = await client.volumes.list();
console.log("Volumes in organization:");
for (const vol of volumeList.items) {
  const usedMB = (vol.used / 1024 / 1024).toFixed(2);
  const capacityMB = (vol.capacity / 1024 / 1024).toFixed(2);
  const percentUsed = ((vol.used / vol.capacity) * 100).toFixed(2);
  console.log(`  ${vol.slug} (${vol.region})`);
  console.log(`    Used: ${usedMB} MB / ${capacityMB} MB (${percentUsed}%)`);
}

console.log("\n=== Cleanup ===\n");

// Delete the volume when done (optional - you might want to keep it!)
await client.volumes.delete(volume.slug);
console.log("Deleted volume:", volume.slug);

console.log("\nAll done!");
