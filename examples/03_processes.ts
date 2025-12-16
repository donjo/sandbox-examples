/**
 * Example 3: Spawning Processes
 *
 * Beyond simple shell commands, you can spawn full processes and capture
 * their output. This gives you more control over how programs run.
 */

import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

console.log("=== Basic Process Spawning ===\n");

// Spawn a process and wait for its output
// This runs "ls" with the "-la" flag (detailed listing)
const lsProcess = sandbox.spawn("ls", { args: ["-la"] });
const lsOutput = await lsProcess.output();

// The output comes as raw bytes, so we convert to text
const listing = new TextDecoder().decode(lsOutput.stdout);
console.log("Directory listing:");
console.log(listing);

console.log("=== Running a Script ===\n");

// First, let's create a simple script file
await sandbox.writeTextFile("greet.sh", `#!/bin/bash
echo "Hello from the script!"
echo "Arguments received: $@"
`);

// Make it executable
await sandbox.sh`chmod +x greet.sh`;

// Run the script with arguments
const scriptProcess = sandbox.spawn("./greet.sh", {
  args: ["arg1", "arg2", "arg3"],
});
const scriptOutput = await scriptProcess.output();
console.log(new TextDecoder().decode(scriptOutput.stdout));

console.log("=== Checking Exit Status ===\n");

// You can check if a command succeeded or failed
const successProcess = sandbox.spawn("echo", { args: ["This will succeed"] });
const successResult = await successProcess.output();
console.log("Success exit code:", successResult.code); // 0 means success

// A failing command
const failProcess = sandbox.spawn("ls", { args: ["/nonexistent/path"] });
const failResult = await failProcess.output();
console.log("Failure exit code:", failResult.code); // Non-zero means error
console.log("Error message:", new TextDecoder().decode(failResult.stderr));

console.log("\nAll done!");
