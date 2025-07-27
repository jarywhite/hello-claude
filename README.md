# Hello Claude

A simple Node.js project featuring a greeter function and a todo list CLI application.

## Features

- **Greeter Module**: Simple hello world functionality
- **Todo CLI**: Command-line todo list manager with persistent storage
- **CLI Tools**: Both `hello` and `todo` commands available globally
- **Testing**: Comprehensive Jest test suite for all functionality

## Installation

```bash
# Clone the repository
git clone https://github.com/jarywhite/hello-claude.git
cd hello-claude

# Install dependencies
npm install

# Install CLI tools globally (optional)
npm link
```

## Usage

### Hello Command

Simple greeting functionality:

```bash
# Default greeting
./bin/hello
# Output: Hello, World!

# Custom greeting
./bin/hello Alice
# Output: Hello, Alice!
```

### Todo Command

Manage your todo list with persistent storage:

```bash
# Add a new todo
todo add "Buy groceries"
# Output: Added: [abc123] Buy groceries (12/25/2023)

# List all todos
todo list
# Output: Found 1 todo(s):
#         [abc123] Buy groceries (12/25/2023)

# Remove a todo by ID
todo remove abc123
# Output: Removed: [abc123] Buy groceries (12/25/2023)

# Show help
todo help
# Output: Usage and command information
```

#### Todo Commands

- `todo add <text>` - Add a new todo item
- `todo list` - List all todo items
- `todo remove <id>` - Remove a todo item by ID
- `todo help` - Show help information

## API Documentation

### Greeter Module (`src/greeter.js`)

```javascript
const { sayHello } = require('./src/greeter');

// Returns a greeting string
sayHello('World'); // "Hello, World!"
```

### TodoList Module (`src/todoList.js`)

```javascript
const { add, list, remove } = require('./src/todoList');

// Add a new todo item
const newTodo = add('Buy milk');
// Returns: { id: 'abc123', text: 'Buy milk', createdAt: '2023-12-25T00:00:00.000Z' }

// List all todos
const todos = list();
// Returns: Array of todo objects

// Remove a todo by ID
const removedTodo = remove('abc123');
// Returns: The removed todo object
// Throws: Error if todo not found
```

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Project Structure

```
hello-claude/
├── bin/
│   ├── hello          # Hello CLI script
│   └── todo           # Todo CLI script
├── src/
│   ├── greeter.js     # Greeter module
│   ├── greeter.test.js# Greeter tests
│   ├── todoList.js    # Todo list module
│   └── todoList.test.js# Todo list tests
├── bin/
│   └── todo.test.js   # CLI integration tests
├── package.json       # Project configuration
├── todos.json         # Todo data storage (created automatically)
├── CLAUDE.md          # Claude Code instructions
└── README.md          # This file
```

### Data Storage

Todo items are stored in `todos.json` in the current working directory. The file is created automatically when you add your first todo item.

Each todo item has the following structure:

```json
{
  "id": "unique-id",
  "text": "Todo item text",
  "createdAt": "2023-12-25T00:00:00.000Z"
}
```

## Testing

The project includes comprehensive tests:

- **Unit Tests**: Test individual functions with mocked dependencies
- **Integration Tests**: Test CLI functionality end-to-end
- **Error Handling**: Test edge cases and error scenarios

Test files:
- `src/greeter.test.js` - Tests for the greeter module
- `src/todoList.test.js` - Tests for the todo list module with mocked file system
- `bin/todo.test.js` - Integration tests for the todo CLI

## License

ISC