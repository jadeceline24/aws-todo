import './App.css';
import {API} from 'aws-amplify';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import {useEffect, useState} from 'react';
const initialFormState = {name: '', description: ''};

function App() {
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  async function fetchTodos() {
    try {
      const response = await API.graphql({
        query: queries.listTodos,
      });
      setTodos(response.data.listTodos.items);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);
  async function createTodos() {
    try {
      if (!formData.name) return;
      await API.graphql({
        query: mutations.createTodo,
        variables: {
          input: formData,
        },
      });

      setTodos([...todos, formData]);
      setFormData(initialFormState);
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteTodo({id}) {
    if (!window.confirm('Do you want to delete this?')) return;
    const newTodosArray = todos.filter((todo) => todo.id !== id);
    setTodos(newTodosArray);
    await API.graphql({
      query: mutations.deleteTodo,
      variables: {
        input: {id},
      },
    });
  }

  return (
    <div className="App">
      <h1>Todos</h1>
      <div className="todos">
        <input
          type="text"
          placeholder="Todos"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input
          type="text"
          placeholder="Todos"
          value={formData.description}
          onChange={(e) =>
            setFormData({...formData, description: e.target.value})
          }
        />
        <button onClick={createTodos}>Create Todo</button>
      </div>
      {todos.map((todo) => (
        <div className="listTodos" key={todo.id}>
          <h2>{todo.name}</h2>
          <p>{todo.description}</p>
          <button onClick={() => deleteTodo(todo)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
