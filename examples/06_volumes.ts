/**
 * Example 6: Working with Volumes
 *
 * This script creates a persistent volume, mounts it to a sandbox,
 * and writes a 1MB test file to demonstrate volume storage.
 */

import { Client, Sandbox } from "@deno/sandbox";

// The Client is used for managing volumes (separate from Sandbox)
const client = new Client({
  token: Deno.env.get("DENO_DEPLOY_TOKEN")!,
});

// Generate a random volume name to avoid conflicts
const VOLUME_SLUG = `testvol-${Math.floor(Math.random() * 100000000)}`;
const VOLUME_REGION = "ord";

console.log("=== Creating a Volume ===\n");

// Create a new volume with 1GB capacity
const volume = await client.volumes.create({
  slug: VOLUME_SLUG,
  region: VOLUME_REGION,
  capacity: "1GB",
});

console.log("Created volume:");
console.log("  Slug:", volume.slug);
console.log("  Region:", volume.region);
console.log("  Capacity:", volume.capacity, "bytes");

console.log("\n=== Mounting Volume in a Sandbox ===\n");

// Create a sandbox with the volume mounted at /data
await using sandbox = await Sandbox.create({
  volumes: {
    "/data": volume.slug,
  },
});

console.log("Slug:", JSON.stringify(VOLUME_SLUG));
console.log("Sandbox created and volume mounted at /data");

console.log("\n=== Writing a 1MB File ===\n");

// Create a 1MB file (1,048,576 bytes)
const ONE_MB = 1024 * 1024;
const largeData = new Uint8Array(ONE_MB);

// Fill with a pattern so it's not all zeros
for (let i = 0; i < ONE_MB; i++) {
  largeData[i] = i % 256;
}

// Write the file to the volume
await sandbox.fs.writeFile("/data/large-file.bin", largeData);
console.log("Created 1MB file at /data/large-file.bin");

// Verify the file size
const fileInfo = await sandbox.fs.stat("/data/large-file.bin");
console.log("File size:", (fileInfo.size / 1024 / 1024).toFixed(2), "MB");

console.log("\nDone! Volume", volume.slug, "persists after this script ends.");
