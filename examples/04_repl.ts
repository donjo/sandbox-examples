/**
 * Example 4: JavaScript REPL
 *
 * A REPL (Read-Eval-Print-Loop) lets you run JavaScript code interactively.
 * Think of it like a calculator that can execute any JavaScript.
 * This is great for running untrusted code safely!
 */

import { Sandbox } from "@deno/sandbox";

await using sandbox = await Sandbox.create();

// Create a REPL environment inside the sandbox
await using repl = await sandbox.deno.repl();

console.log("=== Basic Evaluation ===\n");

// Simple math
const sum = await repl.eval("2 + 2");
console.log("2 + 2 =", sum);

const calculation = await repl.eval("(10 * 5) / 2 + 3");
console.log("(10 * 5) / 2 + 3 =", calculation);

console.log("\n=== Working with Variables ===\n");

// Variables persist between eval calls
await repl.eval("const greeting = 'Hello'");
await repl.eval("const name = 'Designer'");
const message = await repl.eval("`${greeting}, ${name}!`");
console.log("Message:", message);

console.log("\n=== Defining and Calling Functions ===\n");

// Define a function
await repl.eval(`
  function calculateArea(width, height) {
    return width * height;
  }
`);

// Call it using repl.call() - this is cleaner for passing arguments
const area = await repl.call("calculateArea", 5, 10);
console.log("Area of 5x10:", area);

// Or call with an inline arrow function
const doubled = await repl.call("(x) => x * 2", 21);
console.log("21 doubled:", doubled);

console.log("\n=== Working with Arrays and Objects ===\n");

// Arrays
const numbers = await repl.eval("[1, 2, 3, 4, 5].map(n => n * n)");
console.log("Squared numbers:", numbers);

const filtered = await repl.eval("[1, 2, 3, 4, 5, 6].filter(n => n % 2 === 0)");
console.log("Even numbers:", filtered);

// Objects
const person = await repl.eval(`({
  name: "Alex",
  role: "Designer",
  skills: ["Figma", "CSS", "JavaScript"]
})`);
console.log("Person object:", person);

console.log("\n=== Running User-Submitted Code Safely ===\n");

// This is a key use case - running code you don't fully trust
// The sandbox keeps it isolated from your real system

const userCode = `
  // Imagine this came from a user input
  const data = [10, 20, 30, 40, 50];
  const average = data.reduce((a, b) => a + b) / data.length;
  average;
`;

const result = await repl.eval(userCode);
console.log("User code calculated average:", result);

console.log("\nAll done!");
