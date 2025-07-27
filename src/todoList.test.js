const fs = require('fs');
const { add, list, remove } = require('./todoList');

// Mock the fs module
jest.mock('fs');

describe('TodoList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list()', () => {
    test('should return empty array when no todos file exists', () => {
      fs.existsSync.mockReturnValue(false);
      
      const result = list();
      
      expect(result).toEqual([]);
      expect(fs.existsSync).toHaveBeenCalled();
    });

    test('should return todos from file when file exists', () => {
      const mockTodos = [
        { id: '1', text: 'Test todo', createdAt: '2023-01-01T00:00:00.000Z' }
      ];
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockTodos));
      
      const result = list();
      
      expect(result).toEqual(mockTodos);
      expect(fs.readFileSync).toHaveBeenCalled();
    });

    test('should return empty array when file is corrupted', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('invalid json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = list();
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('add()', () => {
    test('should add a new todo item', () => {
      const mockTodos = [];
      fs.existsSync.mockReturnValue(false);
      fs.writeFileSync.mockImplementation();
      
      const result = add('Test todo');
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('text', 'Test todo');
      expect(result).toHaveProperty('createdAt');
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    test('should add todo to existing list', () => {
      const existingTodos = [
        { id: '1', text: 'Existing todo', createdAt: '2023-01-01T00:00:00.000Z' }
      ];
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(existingTodos));
      fs.writeFileSync.mockImplementation();
      
      const result = add('New todo');
      
      expect(result.text).toBe('New todo');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('New todo')
      );
    });

    test('should handle empty string todo', () => {
      fs.existsSync.mockReturnValue(false);
      fs.writeFileSync.mockImplementation();
      
      const result = add('');
      
      expect(result.text).toBe('');
      expect(result).toHaveProperty('id');
    });

    test('should generate unique IDs for different todos', () => {
      fs.existsSync.mockReturnValue(false);
      fs.writeFileSync.mockImplementation();
      
      const todo1 = add('Todo 1');
      const todo2 = add('Todo 2');
      
      expect(todo1.id).not.toBe(todo2.id);
    });
  });

  describe('remove()', () => {
    test('should remove existing todo', () => {
      const mockTodos = [
        { id: '1', text: 'Todo 1', createdAt: '2023-01-01T00:00:00.000Z' },
        { id: '2', text: 'Todo 2', createdAt: '2023-01-01T00:00:00.000Z' }
      ];
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockTodos));
      fs.writeFileSync.mockImplementation();
      
      const result = remove('1');
      
      expect(result).toEqual(mockTodos[0]);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.any(String),
        expect.not.stringContaining('Todo 1')
      );
    });

    test('should throw error when todo not found', () => {
      const mockTodos = [
        { id: '1', text: 'Todo 1', createdAt: '2023-01-01T00:00:00.000Z' }
      ];
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockTodos));
      
      expect(() => remove('nonexistent')).toThrow('Todo with id "nonexistent" not found');
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    test('should handle empty todo list', () => {
      fs.existsSync.mockReturnValue(false);
      
      expect(() => remove('1')).toThrow('Todo with id "1" not found');
    });
  });

  describe('error handling', () => {
    test('should handle file write errors', () => {
      fs.existsSync.mockReturnValue(false);
      fs.writeFileSync.mockImplementation(() => {
        throw new Error('Write failed');
      });
      
      expect(() => add('Test todo')).toThrow('Write failed');
    });

    test('should handle file read errors gracefully', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation(() => {
        throw new Error('Read failed');
      });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = list();
      
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error loading todos:',
        'Read failed'
      );
      
      consoleSpy.mockRestore();
    });
  });
});