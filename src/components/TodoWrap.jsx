import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm.jsx';
import { v4 as uuidv4 } from 'uuid';
import Todo from './Todo.jsx';

const TodoWrap = () => {
  const [todos, setTodos] = useState([]);

  const [userName, setUserName] = useState("")

  const [newTodo, setNewTodo] = useState("")

  useEffect(() => {
    console.log(todos);
  }, [todos]);

  const addTodo = todo => {
    if (todo.trim() !== "") {
      setTodos(prevTodos => [...prevTodos, { id: uuidv4(), task: todo, completed: false, isEditing: false }]);
    }
  };

  const toggleComplete = id => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = id => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Calcular tareas no completadas
  let incompletedCount = 0
  if (todos) {
    incompletedCount = todos.filter(todo => !todo.completed).length;
  }

  const handlerInputName = async (e) => {
    try {
      setUserName(e.target.value)
      const response = await fetch(`https://playground.4geeks.com/todo/users/${e.target.value}`)
      let data = await response.json()
      setTodos(data.todos)
    } catch (error) {
      console.error(error);
    }
  }

  const handlerUserCreation = async () => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
        method: "POST",
      })
    } catch (error) {
      console.error(error)
    }
  }

  const sendInputApi = async () => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/todo/${todos.id}`)
    } catch (error) {
      console.log(error)
    }
  }

  return (


    <div className='TodoWrap'>
      <input type="text" className='userNameInput' placeholder='login, or:' value={userName} onChange={handlerInputName} />
      <button className='btnuser' onClick={handlerUserCreation}>Create user</button>
      <h1>This is how the day looks</h1>
      <TodoForm addTodo={addTodo} />
      {todos && todos.map((todo) => (
        <Todo task={todo} key={todo.id} toggleComplete={toggleComplete} sendInputApi={sendInputApi} deleteTodo={deleteTodo} />
      ))}
      {/* Mensaje de no hay tareas o número de pendientes */}
      {!todos ? (
        <p>No tasks pending. Enjoy your day!</p>
      ) : (
        <p>You have {incompletedCount} {incompletedCount === 1 ? 'task' : 'tasks'} pending.</p>
      )}
    </div>
  );
}//changing tasks

export default TodoWrap;
