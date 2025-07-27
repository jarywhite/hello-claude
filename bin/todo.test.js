const { execSync } = require('child_process');
const path = require('path');

const TODO_BIN = path.join(__dirname, 'todo');

// Helper function to run the CLI and capture output
function runCLI(args = []) {
  try {
    const command = `node "${TODO_BIN}" ${args.join(' ')}`;
    const output = execSync(command, { encoding: 'utf8', cwd: process.cwd() });
    return { output, exitCode: 0 };
  } catch (error) {
    const output = (error.stdout || '') + (error.stderr || '');
    return { 
      output, 
      exitCode: error.status || 1 
    };
  }
}

describe('Todo CLI', () => {
  beforeEach(() => {
    // Clean up any existing todos.json file before each test
    try {
      const fs = require('fs');
      const todosFile = path.join(process.cwd(), 'todos.json');
      if (fs.existsSync(todosFile)) {
        fs.unlinkSync(todosFile);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('help command', () => {
    test('should show help when no arguments provided', () => {
      const { output, exitCode } = runCLI([]);
      
      expect(exitCode).toBe(0);
      expect(output).toContain('Usage: todo <command>');
      expect(output).toContain('Commands:');
      expect(output).toContain('add <text>');
      expect(output).toContain('list');
      expect(output).toContain('remove <id>');
    });

    test('should show help when help command is used', () => {
      const { output, exitCode } = runCLI(['help']);
      
      expect(exitCode).toBe(0);
      expect(output).toContain('Usage: todo <command>');
      expect(output).toContain('Examples:');
    });
  });

  describe('add command', () => {
    test('should add a new todo item', () => {
      const { output, exitCode } = runCLI(['add', 'Test todo item']);
      
      expect(exitCode).toBe(0);
      expect(output).toContain('Added:');
      expect(output).toContain('Test todo item');
      expect(output).toMatch(/\[[a-z0-9]+\]/); // Should contain an ID in brackets
    });

    test('should handle multi-word todo items', () => {
      const { output, exitCode } = runCLI(['add', 'Buy', 'groceries', 'and', 'cook', 'dinner']);
      
      expect(exitCode).toBe(0);
      expect(output).toContain('Buy groceries and cook dinner');
    });

    test('should show error when no text provided', () => {
      const { output, exitCode } = runCLI(['add']);
      
      expect(exitCode).toBe(1);
      expect(output).toContain('Error: Please provide text for the todo item');
      expect(output).toContain('Usage: todo add <text>');
    });
  });

  describe('list command', () => {
    test('should show no todos message when list is empty', () => {
      const { output, exitCode } = runCLI(['list']);
      
      expect(exitCode).toBe(0);
      expect(output).toContain('No todos found');
    });

    test('should list existing todos', () => {
      // First add a todo
      runCLI(['add', 'First todo']);
      runCLI(['add', 'Second todo']);
      
      const { output, exitCode } = runCLI(['list']);
      
      expect(exitCode).toBe(0);
      expect(output).toContain('Found 2 todo(s)');
      expect(output).toContain('First todo');
      expect(output).toContain('Second todo');
    });
  });

  describe('remove command', () => {
    test('should remove existing todo', () => {
      // First add a todo
      const addResult = runCLI(['add', 'Todo to remove']);
      const idMatch = addResult.output.match(/\[([a-z0-9]+)\]/);
      expect(idMatch).not.toBeNull();
      const todoId = idMatch[1];
      
      const { output, exitCode } = runCLI(['remove', todoId]);
      
      expect(exitCode).toBe(0);
      expect(output).toContain('Removed:');
      expect(output).toContain('Todo to remove');
    });

    test('should show error when trying to remove non-existent todo', () => {
      const { output, exitCode } = runCLI(['remove', 'nonexistent']);
      
      expect(exitCode).toBe(1);
      expect(output).toContain('Error: Todo with id "nonexistent" not found');
    });

    test('should show error when no ID provided', () => {
      const { output, exitCode } = runCLI(['remove']);
      
      expect(exitCode).toBe(1);
      expect(output).toContain('Error: Please provide the ID of the todo to remove');
      expect(output).toContain('Usage: todo remove <id>');
    });
  });

  describe('unknown command', () => {
    test('should show error for unknown command', () => {
      const { output, exitCode } = runCLI(['unknown']);
      
      expect(exitCode).toBe(1);
      expect(output).toContain('Error: Unknown command "unknown"');
      expect(output).toContain('Usage: todo <command>');
    });
  });

  describe('integration workflow', () => {
    test('should support complete add-list-remove workflow', () => {
      // Add multiple todos
      const add1 = runCLI(['add', 'First task']);
      const add2 = runCLI(['add', 'Second task']);
      
      expect(add1.exitCode).toBe(0);
      expect(add2.exitCode).toBe(0);
      
      // List todos
      const list1 = runCLI(['list']);
      expect(list1.exitCode).toBe(0);
      expect(list1.output).toContain('Found 2 todo(s)');
      expect(list1.output).toContain('First task');
      expect(list1.output).toContain('Second task');
      
      // Remove one todo
      const idMatch = add1.output.match(/\[([a-z0-9]+)\]/);
      const todoId = idMatch[1];
      const remove = runCLI(['remove', todoId]);
      expect(remove.exitCode).toBe(0);
      
      // List again to verify removal
      const list2 = runCLI(['list']);
      expect(list2.exitCode).toBe(0);
      expect(list2.output).toContain('Found 1 todo(s)');
      expect(list2.output).not.toContain('First task');
      expect(list2.output).toContain('Second task');
    });
  });
});