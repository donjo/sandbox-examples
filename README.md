# Deno Sandbox Examples

Examples demonstrating the [`@deno/sandbox`](https://jsr.io/@deno/sandbox) package capabilities. These examples are primarily used for generating sandbox usage simulations to aid in local development of Deno Deploy, but they can be adapted for real application use.

## What is a Sandbox?

A sandbox is an isolated environment where you can safely run code, manipulate files, and execute commands without affecting your real system. Think of it like a virtual container that keeps everything separate.

## Examples

| Example | Command | Description |
|---------|---------|-------------|
| Shell Commands | `deno task shell` | Run terminal commands in isolation |
| File Operations | `deno task files` | Create, read, copy, and delete files |
| Process Spawning | `deno task processes` | Run programs and capture their output |
| JavaScript REPL | `deno task repl` | Execute JavaScript code interactively |
| HTTP Server | `deno task http` | Run a web server inside the sandbox |
| Volumes | `deno task volumes` | Persistent storage across sandbox sessions |

Run all examples in sequence with `deno task all`.

## Setup

1. Clone this repository
2. Copy `.env.example` to `.env`
3. Add your Deno Deploy token and endpoints to `.env`:

```bash
DENO_DEPLOY_TOKEN=your_token_here
DENO_DEPLOY_CONSOLE_ENDPOINT=https://localhost:8000
DENO_DEPLOY_ENDPOINT=http://localhost:8080
```

4. Run an example:

```bash
deno task shell
```

## Adapting for Real Applications

While these examples are designed for local development simulation, the patterns shown can be applied to production use cases like:

- **Running untrusted code safely** - Execute user-submitted code without risking your system
- **Isolated testing environments** - Run tests in clean, reproducible environments
- **Multi-tenant applications** - Give each user their own isolated execution space
- **Build systems** - Compile and run code in controlled environments

## Resources

- [@deno/sandbox on JSR](https://jsr.io/@deno/sandbox)
- [Deno Deploy Documentation](https://docs.deno.com/deploy/manual/)
