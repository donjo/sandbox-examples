/**
 * Example 2: File Operations
 *
 * The sandbox has its own filesystem that's completely separate from your computer.
 * You can create, read, write, copy, and delete files safely.
 */

import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

console.log("=== Creating and Reading Files ===\n");

// Write a simple text file
await sandbox.writeTextFile("hello.txt", "Hello, sandbox world!");
console.log("Created hello.txt");

// Read it back
const content = await sandbox.readTextFile("hello.txt");
console.log("Contents:", content);

// Get file info (size, dates, etc.)
const info = await sandbox.stat("hello.txt");
console.log("File size:", info.size, "bytes");

console.log("\n=== Working with Directories ===\n");

// Create a folder
await sandbox.mkdir("my_project");
console.log("Created my_project/ folder");

// Create nested folders (like mkdir -p)
await sandbox.mkdir("my_project/src/components", { recursive: true });
console.log("Created nested folders");

// Write files in the folder
await sandbox.writeTextFile("my_project/README.md", "# My Project\n\nThis is a test project.");
await sandbox.writeTextFile("my_project/src/index.ts", "console.log('Hello!');");

// List folder contents
console.log("\nContents of my_project/:");
for await (const entry of sandbox.readDir("my_project")) {
  const type = entry.isDirectory ? "folder" : "file";
  console.log(`  ${entry.name} (${type})`);
}

console.log("\n=== Copying and Moving Files ===\n");

// Copy a file
await sandbox.copyFile("hello.txt", "hello_backup.txt");
console.log("Copied hello.txt to hello_backup.txt");

// Rename/move a file
await sandbox.rename("hello_backup.txt", "my_project/hello_backup.txt");
console.log("Moved backup into my_project/");

console.log("\n=== Cleanup ===\n");

// Delete a single file
await sandbox.remove("hello.txt");
console.log("Deleted hello.txt");

// Delete a folder and everything inside it
await sandbox.remove("my_project", { recursive: true });
console.log("Deleted my_project/ and all its contents");

console.log("\nAll done!");
