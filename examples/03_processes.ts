/**
 * Example 3: Running Processes
 *
 * This example shows how to run commands and scripts in the sandbox
 * using the sh template literal. This is a simple and reliable way
 * to execute shell commands and capture their output.
 */

import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

console.log("=== Running Commands ===\n");

// Run a command using the sh template literal
// The output automatically prints to the console
console.log("Directory listing:");
await sandbox.sh`ls -la`;

console.log("\n=== Running a Script ===\n");

// First, let's create a simple script file
await sandbox.fs.writeTextFile(
  "greet.sh",
  `#!/bin/bash
echo "Hello from the script!"
echo "Arguments received: $@"
`,
);

// Make it executable
await sandbox.sh`chmod +x greet.sh`;

// Run the script with arguments
await sandbox.sh`./greet.sh arg1 arg2 arg3`;

console.log("\n=== Checking Command Results ===\n");

// A successful command just runs
console.log("Running a successful command:");
await sandbox.sh`echo "This will succeed"`;

// For commands that might fail, we can use shell conditionals
// This checks if a path exists and reports the result
console.log("\nChecking a nonexistent path:");
await sandbox.sh`
if ls /nonexistent/path 2>/dev/null; then
  echo "Path exists"
else
  echo "Path does not exist (this is expected)"
fi
`;

console.log("\nAll done!");
