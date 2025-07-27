# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js project featuring a greeter module and a todo list CLI application with persistent storage. The project includes comprehensive Jest testing and both programmatic APIs and command-line interfaces.

## Development Commands

```bash
npm test           # Run all Jest tests (unit + integration)
npm test -- --watch    # Run tests in watch mode
npm test -- --coverage # Run tests with coverage report

./bin/hello [name]      # Hello CLI command
./bin/todo <command>    # Todo CLI commands (add/list/remove/help)
```

## Code Architecture

### Core Modules
- `src/greeter.js` - Simple greeting functionality with `sayHello(name)` export
- `src/todoList.js` - Todo list management with `add()`, `list()`, `remove()` functions
- Persistent JSON storage in `todos.json` (auto-created)

### CLI Applications  
- `bin/hello` - Hello world CLI taking optional name argument
- `bin/todo` - Full-featured todo CLI with subcommands:
  - `todo add <text>` - Add new todo item
  - `todo list` - List all todos with IDs and dates
  - `todo remove <id>` - Remove todo by ID
  - `todo help` - Show usage information

### Testing
- `src/greeter.test.js` - Unit tests for greeter module
- `src/todoList.test.js` - Unit tests with mocked file system
- `bin/todo.test.js` - Integration tests for CLI functionality
- Full test coverage including error handling and edge cases

### Configuration
- `package.json` - Node.js project with bin entries for both CLIs
- `README.md` - Complete usage documentation and API reference
- `.gitignore` - Excludes node_modules and temporary files
- `todos.json` - Auto-generated data file (not in git)

## Claude Code Configuration

- Uses `.claude/settings.local.json` for permissions configuration
- Allows necessary bash commands for development and testing
- Configured for Node.js development workflow

## Todo CLI Usage

```bash
# Add todos
todo add "Buy groceries"
todo add "Write documentation"

# List all todos  
todo list

# Remove by ID (get ID from list command)
todo remove abc123def

# Show help
todo help
```

## Current State

- Git repository initialized and connected to GitHub
- Node.js project with Jest testing framework
- Two working CLI applications with bin entries
- Comprehensive test suite (27 tests passing)
- Complete documentation in README.md
- Persistent todo storage with JSON file
- Ready for further feature development