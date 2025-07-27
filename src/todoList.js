const fs = require('fs');
const path = require('path');

const TODO_FILE = path.join(process.cwd(), 'todos.json');

function loadTodos() {
  try {
    if (fs.existsSync(TODO_FILE)) {
      const data = fs.readFileSync(TODO_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading todos:', error.message);
  }
  return [];
}

function saveTodos(todos) {
  try {
    fs.writeFileSync(TODO_FILE, JSON.stringify(todos, null, 2));
  } catch (error) {
    console.error('Error saving todos:', error.message);
    throw error;
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function add(item) {
  const todos = loadTodos();
  const newTodo = {
    id: generateId(),
    text: item,
    createdAt: new Date().toISOString()
  };
  todos.push(newTodo);
  saveTodos(todos);
  return newTodo;
}

function list() {
  return loadTodos();
}

function remove(id) {
  const todos = loadTodos();
  const index = todos.findIndex(todo => todo.id === id);
  
  if (index === -1) {
    throw new Error(`Todo with id "${id}" not found`);
  }
  
  const removedTodo = todos.splice(index, 1)[0];
  saveTodos(todos);
  return removedTodo;
}

module.exports = { add, list, remove };