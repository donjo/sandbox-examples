/**
 * Example 9: Downloading Files from the Sandbox
 *
 * This example shows the complete file transfer round-trip:
 * 1. Upload files TO the sandbox
 * 2. Process them inside the sandbox
 * 3. Download the results BACK to your local machine
 *
 * This is useful for workflows like:
 * - Processing images (resize, convert formats)
 * - Compiling or transforming code
 * - Running scripts that generate output files
 * - Any "send work in, get results out" pipeline
 *
 * NEW in v0.5.0: The download() method lets you retrieve files from the sandbox!
 */

import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create({
  labels: {
    purpose: "download-example",
  },
});

console.log("=== File Transfer Round-Trip Demo ===\n");

// Step 1: Create some files IN the sandbox that we'll later download
// (In a real scenario, you might upload files first, then process them)

console.log("Step 1: Creating files inside the sandbox...\n");

// Create a simple text file
await sandbox.fs.writeTextFile(
  "/home/user/report.txt",
  `Project Report
==============
Generated: ${new Date().toISOString()}

This file was created inside the sandbox.
You can download it to your local machine!
`
);
console.log("  Created: /home/user/report.txt");

// Create a JSON data file (simulating processed data)
await sandbox.fs.writeTextFile(
  "/home/user/data.json",
  JSON.stringify(
    {
      processed: true,
      items: [
        { id: 1, name: "Widget A", price: 9.99 },
        { id: 2, name: "Widget B", price: 14.99 },
        { id: 3, name: "Widget C", price: 19.99 },
      ],
      total: 44.97,
    },
    null,
    2
  )
);
console.log("  Created: /home/user/data.json");

// Create a directory with multiple files (simulating build output)
await sandbox.fs.mkdir("/home/user/output");
await sandbox.fs.writeTextFile("/home/user/output/index.html", "<html><body><h1>Hello!</h1></body></html>");
await sandbox.fs.writeTextFile("/home/user/output/style.css", "body { font-family: sans-serif; }");
await sandbox.fs.writeTextFile("/home/user/output/app.js", "console.log('App loaded');");
console.log("  Created: /home/user/output/ directory with 3 files");

// Step 2: Download files to your local machine
// Files will be saved to /tmp so they don't clutter your project

console.log("\nStep 2: Downloading files to local machine...\n");

// Download a single file
await sandbox.fs.download("/home/user/report.txt", "/tmp/sandbox-demo/report.txt");
console.log("  Downloaded: report.txt -> /tmp/sandbox-demo/report.txt");

// Download another single file
await sandbox.fs.download("/home/user/data.json", "/tmp/sandbox-demo/data.json");
console.log("  Downloaded: data.json -> /tmp/sandbox-demo/data.json");

// Download an entire directory (all files inside it)
await sandbox.fs.download("/home/user/output", "/tmp/sandbox-demo/output");
console.log("  Downloaded: output/ directory -> /tmp/sandbox-demo/output/");

// Step 3: Verify the downloads worked by reading locally
console.log("\nStep 3: Verifying downloaded files...\n");

// Read the downloaded report
const reportContent = await Deno.readTextFile("/tmp/sandbox-demo/report.txt");
console.log("Contents of downloaded report.txt:");
console.log("---");
console.log(reportContent);
console.log("---");

// Read the downloaded JSON
const jsonContent = await Deno.readTextFile("/tmp/sandbox-demo/data.json");
const data = JSON.parse(jsonContent);
console.log("\nParsed data.json:");
console.log("  Items:", data.items.length);
console.log("  Total:", data.total);

// List the downloaded directory contents
console.log("\nContents of downloaded output/ directory:");
for await (const entry of Deno.readDir("/tmp/sandbox-demo/output")) {
  console.log("  ", entry.name);
}

console.log("\n=== Round-Trip Complete! ===");
console.log("\nFiles are saved at: /tmp/sandbox-demo/");
console.log("The sandbox will now close, but your downloaded files remain.");
