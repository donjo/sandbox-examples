# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Deno project that uses the `@deno/sandbox` package for running isolated code execution environments. The examples demonstrate shell commands, file operations, process spawning, JavaScript REPL, and HTTP servers.

## Setup

1. Copy `.env.example` to `.env`
2. Fill in your `DENO_DEPLOY_TOKEN` in the `.env` file

## Running Examples

```bash
deno task shell      # Basic shell commands
deno task files      # File operations (read, write, copy, delete)
deno task processes  # Spawning and controlling processes
deno task repl       # JavaScript REPL for running code interactively
deno task http       # HTTP server inside the sandbox
deno task all        # Run all examples in sequence
```

## Other Commands

```bash
deno fmt             # Format code
deno lint            # Lint code
deno check <file>    # Type-check without running
```

## Dependencies

Dependencies are managed through `deno.json` using JSR imports. The lock file (`deno.lock`) tracks exact versions.
