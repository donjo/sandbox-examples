/**
 * Example 10: File Discovery with walk() and expandGlob()
 *
 * When working with projects, you often need to find files:
 * - "Find all TypeScript files in this project"
 * - "List everything in the src folder and subfolders"
 * - "Find all JSON config files"
 *
 * This example shows two powerful NEW methods (v0.5.0):
 *
 * 1. walk() - Recursively walks through ALL files and folders
 *    Like walking through every room in a building
 *
 * 2. expandGlob() - Finds files matching a pattern
 *    Like searching for "*.txt" to find all text files
 */

import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create({
  labels: {
    purpose: "file-discovery",
  },
});

console.log("=== File Discovery Demo ===\n");

// First, let's create a realistic project structure to explore
console.log("Setting up a sample project structure...\n");

// Create a mock project with various file types
await sandbox.fs.mkdir("/home/user/my-project/src/components", { recursive: true });
await sandbox.fs.mkdir("/home/user/my-project/src/utils", { recursive: true });
await sandbox.fs.mkdir("/home/user/my-project/public/images", { recursive: true });
await sandbox.fs.mkdir("/home/user/my-project/tests", { recursive: true });

// Add various files
await sandbox.fs.writeTextFile("/home/user/my-project/package.json", '{"name": "my-project"}');
await sandbox.fs.writeTextFile("/home/user/my-project/tsconfig.json", '{"compilerOptions": {}}');
await sandbox.fs.writeTextFile("/home/user/my-project/README.md", "# My Project");
await sandbox.fs.writeTextFile("/home/user/my-project/.gitignore", "node_modules/");

await sandbox.fs.writeTextFile("/home/user/my-project/src/index.ts", "export * from './components';");
await sandbox.fs.writeTextFile("/home/user/my-project/src/types.ts", "export type User = { name: string };");
await sandbox.fs.writeTextFile("/home/user/my-project/src/components/Button.tsx", "export const Button = () => {};");
await sandbox.fs.writeTextFile("/home/user/my-project/src/components/Card.tsx", "export const Card = () => {};");
await sandbox.fs.writeTextFile("/home/user/my-project/src/components/index.ts", "export * from './Button';");
await sandbox.fs.writeTextFile("/home/user/my-project/src/utils/helpers.ts", "export const helper = () => {};");
await sandbox.fs.writeTextFile("/home/user/my-project/src/utils/format.ts", "export const format = () => {};");

await sandbox.fs.writeTextFile("/home/user/my-project/public/index.html", "<html></html>");
await sandbox.fs.writeTextFile("/home/user/my-project/public/images/logo.png", "fake-image-data");
await sandbox.fs.writeTextFile("/home/user/my-project/public/images/hero.jpg", "fake-image-data");

await sandbox.fs.writeTextFile("/home/user/my-project/tests/Button.test.ts", "test('button', () => {});");
await sandbox.fs.writeTextFile("/home/user/my-project/tests/Card.test.ts", "test('card', () => {});");

console.log("Project structure created!\n");

// ============================================
// PART 1: Using walk() to explore everything
// ============================================

console.log("=== Part 1: walk() - Explore All Files ===\n");
console.log("walk() visits EVERY file and folder recursively.\n");

console.log("All files in the project:");
console.log("-".repeat(50));

// walk() yields information about each file/folder it encounters
for await (const entry of sandbox.fs.walk("/home/user/my-project", {})) {
  // entry.path = full path to the file/folder
  // entry.name = just the filename
  // entry.isFile = true if it's a file
  // entry.isDirectory = true if it's a folder

  // Make the path shorter for display
  const shortPath = entry.path.replace("/home/user/my-project/", "");

  if (entry.isDirectory) {
    console.log(`📁 ${shortPath}/`);
  } else {
    console.log(`   ${shortPath}`);
  }
}

// ============================================
// PART 2: Using expandGlob() for pattern matching
// ============================================

console.log("\n=== Part 2: expandGlob() - Find by Pattern ===\n");
console.log("expandGlob() finds files matching a pattern (like *.ts)\n");

// Find all TypeScript files
console.log('Pattern: "**/*.ts" (all .ts files in any folder)');
console.log("-".repeat(50));
for await (const entry of sandbox.fs.expandGlob("**/*.ts", {
  root: "/home/user/my-project",
})) {
  const shortPath = entry.path.replace("/home/user/my-project/", "");
  console.log(`  ${shortPath}`);
}

// Find all TSX files (React components)
console.log('\nPattern: "**/*.tsx" (all React component files)');
console.log("-".repeat(50));
for await (const entry of sandbox.fs.expandGlob("**/*.tsx", {
  root: "/home/user/my-project",
})) {
  const shortPath = entry.path.replace("/home/user/my-project/", "");
  console.log(`  ${shortPath}`);
}

// Find all JSON config files
console.log('\nPattern: "*.json" (JSON files in root only)');
console.log("-".repeat(50));
for await (const entry of sandbox.fs.expandGlob("*.json", {
  root: "/home/user/my-project",
})) {
  console.log(`  ${entry.name}`);
}

// Find all test files
console.log('\nPattern: "**/*.test.ts" (all test files)');
console.log("-".repeat(50));
for await (const entry of sandbox.fs.expandGlob("**/*.test.ts", {
  root: "/home/user/my-project",
})) {
  const shortPath = entry.path.replace("/home/user/my-project/", "");
  console.log(`  ${shortPath}`);
}

// Find all image files
console.log('\nPattern: "**/*.{png,jpg}" (all images)');
console.log("-".repeat(50));
for await (const entry of sandbox.fs.expandGlob("**/*.{png,jpg}", {
  root: "/home/user/my-project",
})) {
  const shortPath = entry.path.replace("/home/user/my-project/", "");
  console.log(`  ${shortPath}`);
}

// ============================================
// PART 3: Practical example - Count files by type
// ============================================

console.log("\n=== Part 3: Practical Example ===\n");
console.log("Counting files by extension:\n");

const counts: Record<string, number> = {};

for await (const entry of sandbox.fs.walk("/home/user/my-project", {})) {
  if (entry.isFile) {
    // Get the file extension (like ".ts" or ".json")
    const ext = entry.name.includes(".") ? "." + entry.name.split(".").pop() : "(no extension)";
    counts[ext] = (counts[ext] || 0) + 1;
  }
}

// Display counts sorted by number
const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
for (const [ext, count] of sorted) {
  console.log(`  ${ext.padEnd(15)} ${count} file(s)`);
}

console.log("\n=== File Discovery Complete! ===");
