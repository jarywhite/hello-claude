const { sayHello } = require('./greeter');

describe('sayHello', () => {
  test('should return greeting with provided name', () => {
    expect(sayHello('Alice')).toBe('Hello, Alice!');
  });

  test('should return greeting with different name', () => {
    expect(sayHello('Bob')).toBe('Hello, Bob!');
  });

  test('should handle empty string', () => {
    expect(sayHello('')).toBe('Hello, !');
  });
});